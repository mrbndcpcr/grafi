import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  expectedSessionToken,
  sessionTokenFromPassword,
} from "./lib/session";

function absoluteUrl(request: NextRequest, path: string) {
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.host;
  const proto =
    request.headers.get("x-forwarded-proto") ||
    (request.nextUrl.protocol === "https:" ? "https" : "http");
  return new URL(path, `${proto}://${host}`);
}

function isPublic(pathname: string) {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/logout") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/logo.jpg" ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|woff2?)$/i.test(pathname)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const expected = await expectedSessionToken();
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (expected && token === expected) {
    return NextResponse.next();
  }

  // Migrate legacy raw-password cookie once
  const legacy = request.cookies.get("grafi_studio_auth")?.value;
  const password = process.env.GRAFI_STUDIO_PASSWORD;
  if (password && legacy && legacy === password) {
    const res = NextResponse.next();
    const session = expected || (await sessionTokenFromPassword(password));
    res.cookies.set({
      name: AUTH_COOKIE,
      value: session,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    res.cookies.set({ name: "grafi_studio_auth", value: "", path: "/", maxAge: 0 });
    return res;
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = absoluteUrl(request, "/login");
  if (pathname !== "/") login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
