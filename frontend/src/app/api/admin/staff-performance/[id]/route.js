import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req, context) {
  try {
    const params = await context.params;   // ✅ IMPORTANT FIX
    const { id } = params;

    console.log("STAFF ID FROM URL:", id);

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const itineraries = await prisma.itinerary.findMany({
      where: { createdBy: id },   // ✅ NOW FILTERS PROPERLY
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        destination: true,
        clientName: true,
        status: true,
        createdAt: true,
      },
    });

    console.log("FOUND ITINERARIES COUNT:", itineraries.length);

    return NextResponse.json(itineraries);
  } catch (err) {
    console.error("STAFF ITINERARY LIST ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
