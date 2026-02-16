import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ================= PATCH (UPDATE LEAD) =================
export async function PATCH(req, { params }) {
  try {
    const { id: leadId } = await params; // ✅ FIX FOR NEXT 16

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID missing" },
        { status: 400 }
      );
    }

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

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    const body = await req.json();

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    let updatedLead;

    // STAFF → can only update status
   if (dbUser.role === "STAFF") {
  updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      status: body.status,
      notes: body.notes,   // ✅ allow notes update
    },
  });
}

    // ADMIN → can update everything
    if (dbUser.role === "ADMIN") {
      updatedLead = await prisma.lead.update({
        where: { id: leadId },
        data: {
          clientName: body.clientName,
          mobileNumber: body.mobileNumber,
          destination: body.destination,
          source: body.source,
          notes: body.notes,
          assignedTo: body.assignedTo,
          status: body.status,
        },
      });
    }

    return NextResponse.json(updatedLead);
  } catch (err) {
    console.error("PATCH LEAD ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// ================= DELETE (ADMIN ONLY) =================
export async function DELETE(req, { params }) {
  try {
    const { id: leadId } = await params; // ✅ FIX FOR NEXT 16

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID missing" },
        { status: 400 }
      );
    }

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

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.lead.delete({
      where: { id: leadId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE LEAD ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}