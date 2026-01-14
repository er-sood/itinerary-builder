import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const itineraries = await prisma.itinerary.findMany({
      where: {
        destination: {
          contains: q,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        destination: true,
        clientName: true,
        createdAt: true,
      },
    });

    return NextResponse.json(itineraries);
  } catch (error) {
    console.error("LIST ITINERARY ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}
