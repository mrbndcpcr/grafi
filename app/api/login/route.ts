import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE = "grafi_studio_auth";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    // still run a compare to reduce trivial timing leaks on length
    timingSafeEqual(ab, Buffer.alloc(ab.length));
    return false;
  }
  return timingSafeEqual(ab, bb);
}

export async function POST(request: NextRequest) {
  const expected = process.env.GRAFI_STUDIO_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Studio password is not configured" },
      { status: 500 }
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

  if (!safeEqual(password, expected)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const forwarded = request.headers.get("x-forwarded-proto");
  const secure =
    forwarded === "https" ||
    request.nextUrl.protocol === "https:" ||
    process.env.NODE_ENV === "production";

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE,
    value: expected,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}
