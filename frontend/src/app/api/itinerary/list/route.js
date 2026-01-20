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
    const search = searchParams.get("search") || "";
    const preparedBy = searchParams.get("preparedBy");
    const status = searchParams.get("status");
    const reference = searchParams.get("reference");
    const authHeader = req.headers.get("authorization");
    const client = searchParams.get("client") || "";
    

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
const baseSearch = search
  ? {
      OR: [
        { destination: { contains: search, mode: "insensitive" } },
        { clientName: { contains: search, mode: "insensitive" } },
        { reference: { contains: search, mode: "insensitive" } },
      ],
    }
  : {};
const filters = [];

if (preparedBy) filters.push({ createdBy: preparedBy });
if (status) filters.push({ status });
if (reference) {
  filters.push({
    reference: { contains: reference, mode: "insensitive" },
  });
}



  let where;

if (isAdmin) {
  where = {
    AND: [baseSearch, ...filters],
  };
} else {
  where = {
    AND: [
      baseSearch,
      ...filters,
      {
        OR: [{ createdBy: user.id }, { status: "FINAL" }],
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
