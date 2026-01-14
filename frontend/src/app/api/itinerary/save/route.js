import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const { days, inclusions, exclusions, pricing, trip, client } = body;

    if (!trip?.destination || !days?.length) {
      return NextResponse.json(
        { success: false, error: "Invalid itinerary data" },
        { status: 400 }
      );
    }

    const itinerary = await prisma.itinerary.create({
      data: {
        destination: trip.destination,
        clientName: client?.name || null,
        trip,
        days,
        inclusions,
        exclusions,
        pricing,
        status: "DRAFT",
        createdBy: null, // we’ll connect auth later
      },
    });

    return NextResponse.json({
      success: true,
      itineraryId: itinerary.id,
    });
  } catch (error) {
    console.error("SAVE ITINERARY ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
