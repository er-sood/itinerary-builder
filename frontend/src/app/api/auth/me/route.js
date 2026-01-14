import { NextResponse } from "next/server";

export async function GET(request) {
  const cookie = request.headers.get("cookie");

  if (!cookie || !cookie.includes("user=")) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  try {
    const userCookie = decodeURIComponent(
      cookie
        .split("user=")[1]
        .split(";")[0]
    );

    const user = JSON.parse(userCookie);

    return NextResponse.json({
      authenticated: true,
      username: user.username,
      role: user.role,
    });
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
