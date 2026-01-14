import { NextResponse } from "next/server";

export async function POST(request) {
  const response = NextResponse.redirect(
    new URL("/login", request.url)
  );

  // 🔥 FORCE REMOVE COOKIE (all attributes)
  response.cookies.set({
    name: "user",
    value: "",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}
