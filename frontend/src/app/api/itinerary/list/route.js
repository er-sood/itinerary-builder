export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const clientName = searchParams.get("client") || "";
const preparedBy = searchParams.get("preparedBy") || "";
const referenceBy = searchParams.get("referenceBy") || "";



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
    const filters = [];

if (q) {
  filters.push({
    destination: {
      contains: q,
      mode: "insensitive",
    },
  });
}

if (client) {
  filters.push({
    clientName: {
      contains: client,
      mode: "insensitive",
    },
  });
}

if (reference) {
  filters.push({
    referenceBy: {
      contains: reference,
      mode: "insensitive",
    },
  });
}

if (preparedBy) {
  filters.push({
    user: {
      email: {
        contains: preparedBy,
        mode: "insensitive",
      },
    },
  });
}


    let where;

if (isAdmin) {
  where = filters.length ? { AND: filters } : {};
} else {
  where = {
    AND: [
      ...(filters.length ? filters : []),
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
    user: {                 // 👈 relation
      select: {
        email: true,
        role: true,         // if you have name column
      },
    },
  },
});


    return NextResponse.json(items);
  } catch (error) {
    console.error("LIST ITINERARY ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}
