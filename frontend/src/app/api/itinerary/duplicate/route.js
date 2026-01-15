import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { id, accessToken } = await req.json();

    if (!id || !accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // verify user
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // fetch original
    const existing = await prisma.itinerary.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Itinerary not found" },
        { status: 404 }
      );
    }

    // create duplicate owned by CURRENT USER
    const duplicated = await prisma.itinerary.create({
      data: {
        destination: existing.destination,
        clientName: existing.clientName,
        trip: existing.trip,
        days: existing.days,
        inclusions: existing.inclusions,
        exclusions: existing.exclusions,
        pricing: existing.pricing,

        status: "DRAFT",
        finalizedAt: null,
        createdBy: user.id, // ✅ FIXED
      },
    });

    return NextResponse.json({
      success: true,
      itineraryId: duplicated.id,
    });
  } catch (error) {
    console.error("DUPLICATE ITINERARY ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
