export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const authHeader = req.headers.get("authorization");

if (!authHeader) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const token = authHeader.replace("Bearer ", "");


    // verify user
    const {
      data: { user },
      error,
   } = await supabase.auth.getUser(token);


    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // get role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const isAdmin = dbUser.role === "ADMIN";

    // build where condition
    const baseSearch = q
      ? {
          destination: {
            contains: q,
            mode: "insensitive",
          },
        }
      : {};

    let where;

    if (isAdmin) {
      // admin sees everything
      where = baseSearch;
    } else {
      // staff: own OR final of others
      where = {
        AND: [
          baseSearch,
          {
            OR: [
              { createdBy: user.id },
              { status: "FINAL" },
            ],
          },
        ],
      };
    }

    const items = await prisma.itinerary.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        destination: true,
        clientName: true,
        createdAt: true,
        status: true,
        createdBy: true,
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("LIST ITINERARY ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}
