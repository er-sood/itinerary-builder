import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);

export async function GET(req) {
  try {
    console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("SERVICE KEY EXISTS:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("STAFF PERF — TOKEN RECEIVED:", token?.slice(0, 20));

    // ✅ verify user
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);
    console.log("STAFF PERF — SUPABASE USER:", user);
console.log("STAFF PERF — SUPABASE ERROR:", error);


    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // ✅ check role in DB
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ fetch staff + stats
    const users = await prisma.user.findMany({
      where: { role: "STAFF" },
      select: {
        id: true,
        email: true,
        itineraries: {
          select: { status: true },
        },
      },
    });

    const stats = users.map((u) => {
      const total = u.itineraries.length;
      const finalized = u.itineraries.filter(
        (i) => i.status === "FINAL"
      ).length;
      const draft = total - finalized;

      return {
        id: u.id,
        username: u.email,
        total,
        finalized,
        draft,
      };
    });

    return NextResponse.json(stats);
  } catch (err) {
    console.error("STAFF PERFORMANCE ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
