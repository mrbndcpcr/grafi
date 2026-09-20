import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, authCookieOptions } from "@/lib/session";

function clearAndRedirect(request: NextRequest) {
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
    name: AUTH_COOKIE,
    value: "",
    ...authCookieOptions(0),
  });
  res.cookies.set({ name: "grafi_studio_auth", value: "", path: "/", maxAge: 0 });
  return res;
}

export async function POST(request: NextRequest) {
  return clearAndRedirect(request);
}

export async function GET(request: NextRequest) {
  return clearAndRedirect(request);
}
