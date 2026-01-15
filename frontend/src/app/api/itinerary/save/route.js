import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { days, inclusions, exclusions, pricing, trip, client, accessToken, itineraryId } = body;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // verify user
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!trip?.destination || !days?.length) {
      return NextResponse.json(
        { success: false, error: "Invalid itinerary data" },
        { status: 400 }
      );
    }

    let itinerary;

    if (itineraryId) {
      // UPDATE — only owner or admin later (we'll add admin check next)
      const existing = await prisma.itinerary.findUnique({
        where: { id: itineraryId },
      });

      if (!existing || existing.createdBy !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      itinerary = await prisma.itinerary.update({
        where: { id: itineraryId },
        data: {
          destination: trip.destination,
          clientName: client?.name || null,
          trip,
          days,
          inclusions,
          exclusions,
          pricing,
        },
      });
    } else {
      // CREATE
      itinerary = await prisma.itinerary.create({
        data: {
          destination: trip.destination,
          clientName: client?.name || null,
          trip,
          days,
          inclusions,
          exclusions,
          pricing,
          status: "DRAFT",
          createdBy: user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      itineraryId: itinerary.id,
    });
  } catch (error) {
    console.error("SAVE ITINERARY ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
