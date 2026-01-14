import { NextResponse } from "next/server";

// TEMP in-memory user store
let USERS = [
  { id: 1, username: "admin", role: "ADMIN" },
  { id: 2, username: "staff", role: "STAFF" },
];

// GET — list users
export async function GET() {
  return NextResponse.json(USERS);
}

// POST — create user
export async function POST(req) {
  const { username, password, role } = await req.json();

  if (!username || !password || !role) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const exists = USERS.find(u => u.username === username);
  if (exists) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 409 }
    );
  }

  const newUser = {
    id: Date.now(),
    username,
    role,
  };

  USERS.push(newUser);

  return NextResponse.json(newUser);
}
