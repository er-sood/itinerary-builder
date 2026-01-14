import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    await prisma.itinerary.update({
      where: { id },
      data: {
        status: "FINAL",
        finalizedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("FINALIZE ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
