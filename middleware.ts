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

export async function middleware(request: NextRequest) {
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

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const expected = await expectedSessionToken();

  if (expected && token && token === expected) {
    return NextResponse.next();
  }

  // Migrate one release: old cookie stored the raw password
  const legacy = request.cookies.get("grafi_studio_auth")?.value;
  const password = process.env.GRAFI_STUDIO_PASSWORD;
  if (password && legacy && legacy === password) {
    const res = NextResponse.next();
    res.cookies.set({
      name: AUTH_COOKIE,
      value: await sessionTokenFromPassword(password),
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
  if (pathname !== "/") {
    login.searchParams.set("next", pathname);
  }
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
