export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admin can create leads" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
  clientName,
  mobileNumber,
  destination,
  source,
  notes,
  assignedTo,
} = body;

    if (!clientName || !mobileNumber || !destination || !source) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        clientName,
        mobileNumber,
        destination,
        source,
        assignedTo: assignedTo || null,
        notes,
        createdBy: user.id,
      },
    });

    return NextResponse.json(lead);
  } catch (err) {
    console.error("CREATE LEAD ERROR:", err);
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

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let leads;

    if (dbUser.role === "ADMIN") {
      leads = await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          assignedUser: {
            select: { email: true },
          },
        },
      });
    } else {
  leads = await prisma.lead.findMany({
    where: {
      assignedTo: user.id,
    },
    orderBy: { createdAt: "desc" },
    include: {
      assignedUser: {
        select: { email: true },
      },
    },
  });
}


    return NextResponse.json(leads);
  } catch (err) {
    console.error("GET LEADS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}