export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
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
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();

    const {
      name,
      type,
      country,
      state,
      city,
      stars,
      contactPerson,
      approxPrice,
      notes,
    } = body;

    if (!name || !type || !country || !state || !city) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        name,
        type,
        country,
        state,
        city,
        stars: type === "HOMESTAY" ? null : stars,
        contactPerson,
        approxPrice,
        notes,
        createdBy: user.id,
      },
    });

    return NextResponse.json(property);
  } catch (err) {
    console.error("ADD PROPERTY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


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
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const items = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    return NextResponse.json(items);
  } catch (err) {
    console.error("LIST PROPERTY ERROR:", err);
    return NextResponse.json([], { status: 500 });
  }
}
