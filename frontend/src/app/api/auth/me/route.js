import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    // ✅ PERFORMANCE STATS
    const total = await prisma.itinerary.count({
      where: { createdBy: user.id },
    });

    const finalized = await prisma.itinerary.count({
      where: { createdBy: user.id, status: "FINAL" },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: dbUser?.role || "STAFF",
      stats: {
        total,
        finalized,
        draft: total - finalized,
      },
    });
  } catch (err) {
    console.error("ME ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
