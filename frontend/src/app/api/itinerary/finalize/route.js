import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { id, accessToken } = await req.json();

    if (!id || !accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ VERIFY USER USING SAME CLIENT
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
    });

    if (!itinerary) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // get role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    const isAdmin = dbUser?.role === "ADMIN";
    const isOwner = itinerary.createdBy === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.itinerary.update({
      where: { id },
      data: {
        status: "FINAL",
        finalizedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FINALIZE ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
