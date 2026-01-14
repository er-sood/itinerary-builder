import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, context) {
  try {
    const { id } = await context.params;  // ✅ IMPORTANT

    if (!id) {
      return NextResponse.json(
        { error: "Missing itinerary id" },
        { status: 400 }
      );
    }

    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
    });

    if (!itinerary) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error("GET ITINERARY ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
