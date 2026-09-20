/** Shared studio-auth cookie + session token (Edge-safe). */

export const AUTH_COOKIE = "grafi_studio_session";

/** Stable token derived from studio password — never store the raw password in the cookie. */
export async function sessionTokenFromPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`grafi-creative-ops:v1:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedSessionToken(): Promise<string | null> {
  const password = process.env.GRAFI_STUDIO_PASSWORD;
  if (!password) return null;
  return sessionTokenFromPassword(password);
}

export function authCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: true,
    path: "/",
    maxAge,
  };
}
