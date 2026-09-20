import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "grafi_studio_auth";

function absoluteUrl(request: NextRequest, path: string) {
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.host;
  const proto =
    request.headers.get("x-forwarded-proto") ||
    (request.nextUrl.protocol === "https:" ? "https" : "http");
  const url = new URL(path, `${proto}://${host}`);
  return url;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/logout") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/logo.jpg" ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|woff2?)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE)?.value;
  const expected = process.env.GRAFI_STUDIO_PASSWORD;
  if (expected && token === expected) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = absoluteUrl(request, "/login");
  if (pathname !== "/") {
    login.searchParams.set("next", pathname);
  }
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
