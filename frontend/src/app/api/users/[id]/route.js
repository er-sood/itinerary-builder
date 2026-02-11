import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function DELETE(req, { params }) {
  const userId = Number(params.id);

  // TEMP in-memory access (same USERS reference)
  const globalUsers = globalThis.USERS || [];
  globalThis.USERS = globalUsers;

  const index = globalUsers.findIndex(u => u.id === userId);
  if (index === -1) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  globalUsers.splice(index, 1);

  return NextResponse.json({ success: true });
}
  