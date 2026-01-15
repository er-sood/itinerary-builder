import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {


  try {
      const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop();
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itinerary = await prisma.itinerary.findUnique({
     where: { id },

    });

    if (!itinerary) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    const isOwner = itinerary.createdBy === user.id;
    const isFinal = itinerary.status === "FINAL";
    const isAdmin = dbUser?.role === "ADMIN";

    // 🔐 Access Rules
    if (!isAdmin && !isFinal && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(itinerary);
  } catch (err) {
    console.error("GET ITINERARY ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
