import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, password } = await req.json();

  // Example users (replace later with DB)
  

  const user = users[username];

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set(
  "user",
  JSON.stringify({ username, role: user.role }),
  {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true, // REQUIRED on Vercel (https)
  }
);


  return res;
}
