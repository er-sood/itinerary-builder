import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { email, password, accessToken } = await req.json();

    if (!email || !password || !accessToken) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (dbUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createError) {
      return NextResponse.json(
        { error: createError.message },
        { status: 400 }
      );
    }

    await prisma.user.create({
      data: {
        id: newUser.user.id,
        email,
        role: "STAFF",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CREATE USER ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
