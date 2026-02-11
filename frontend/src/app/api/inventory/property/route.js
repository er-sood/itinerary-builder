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
  starRating,
  contactPerson,
  contactPhone,
  approxPrice,   // 👈 this will store "approx price + notes"
  websiteLink,
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
    starRating: type === "HOMESTAY" ? null : starRating ? Number(starRating) : null,
    contactPerson,
    contactPhone,
    approxPrice,
    websiteLink,
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
    const dbUser = await prisma.user.findUnique({
  where: { id: user.id },
});

    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    let items = await prisma.property.findMany({
  orderBy: { createdAt: "desc" },
  include: {
    user: {
      select: { email: true },
    },
  },
});

// If not admin → hide contactPhone
if (dbUser?.role !== "ADMIN") {
  items = items.map((item) => ({
    ...item,
    contactPhone: null,
  }));
}

    return NextResponse.json(items);
  } catch (err) {
    console.error("LIST PROPERTY ERROR:", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function DELETE(req) {
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

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE PROPERTY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req) {
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

    const dbUser = await prisma.user.findUnique({
  where: { id: user.id },
});

  
    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // If not admin → remove contactPhone from updates
if (dbUser?.role !== "ADMIN") {
  delete updates.contactPhone;
}

const updated = await prisma.property.update({
  where: { id },
  data: {
    ...updates,
    starRating:
      updates.type === "HOMESTAY"
        ? null
        : updates.starRating
        ? Number(updates.starRating)
        : null,
  },
});

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE PROPERTY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
