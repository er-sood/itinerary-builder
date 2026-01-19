export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
    console.log("📥 API /save HIT");
  try {
    const body = await req.json();
    const {
      days,
      inclusions,
      exclusions,
      pricing,
      trip,
      client,
      accessToken,
      itineraryId,
      clientPhone,
      referenceBy,
      marginPercent
    } = body;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ VERIFY USER USING ACCESS TOKEN
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.error("Auth error:", error);
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
          clientPhone: clientPhone || null,
          referenceBy: referenceBy || null,
          marginPercent:
  marginPercent !== "" && marginPercent !== null
    ? Number(marginPercent)
    : null,

          trip,
          days,
          inclusions,
          exclusions,
          pricing,
        },
      });
    } else {
      itinerary = await prisma.itinerary.create({
        data: {
          destination: trip.destination,
          clientName: client?.name || null,
          clientPhone: clientPhone || null,
          referenceBy: referenceBy || null,
          marginPercent:
  marginPercent !== "" && marginPercent !== null
    ? Number(marginPercent)
    : null,

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
