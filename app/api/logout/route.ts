import { NextRequest, NextResponse } from "next/server";

const COOKIE = "grafi_studio_auth";

function loginRedirect(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.host;
  const proto =
    request.headers.get("x-forwarded-proto") ||
    (request.nextUrl.protocol === "https:" ? "https" : "http");
  const res = NextResponse.redirect(new URL("/login", `${proto}://${host}`), {
    status: 303,
  });
  res.cookies.set({
    name: COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function POST(request: NextRequest) {
  return loginRedirect(request);
}

export async function GET(request: NextRequest) {
  return loginRedirect(request);
}
