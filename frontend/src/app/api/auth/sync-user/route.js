import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    // Get user from Supabase
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if user exists in DB
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      // Is this first user? -> ADMIN
      const count = await prisma.user.count();

      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          role: count === 0 ? "ADMIN" : "STAFF",
        },
      });
    }

    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    });
  } catch (err) {
    console.error("SYNC USER ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
