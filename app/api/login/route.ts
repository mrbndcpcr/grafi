import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  authCookieOptions,
  mintSessionToken,
} from "@/lib/session";

const MAX_AGE = 60 * 60 * 24 * 30;

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    timingSafeEqual(ab, Buffer.alloc(ab.length));
    return false;
  }
  return timingSafeEqual(ab, bb);
}

export async function POST(request: NextRequest) {
  const expectedPw = process.env.GRAFI_STUDIO_PASSWORD;
  if (!expectedPw) {
    return NextResponse.json(
      { error: "Studio password is not configured" },
      { status: 500 },
    );
  }

  let password = "";
  const ctype = request.headers.get("content-type") || "";
  if (ctype.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    password = typeof body?.password === "string" ? body.password : "";
  } else {
    const form = await request.formData().catch(() => null);
    const v = form?.get("password");
    password = typeof v === "string" ? v : "";
  }

  if (!safeEqual(password, expectedPw)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await mintSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Session token is not configured" },
      { status: 500 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: AUTH_COOKIE,
    value: token,
    ...authCookieOptions(MAX_AGE),
  });
  res.cookies.set({ name: "grafi_studio_auth", value: "", path: "/", maxAge: 0 });
  return res;
}
