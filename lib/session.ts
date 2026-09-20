/** Shared studio-auth cookie (Edge-safe). */

export const AUTH_COOKIE = "grafi_studio_session";

/**
 * Opaque session value stored in the cookie after a successful password login.
 * Prefer GRAFI_SESSION_TOKEN (stable, not the password). Falls back to a hash of the password.
 */
export async function expectedSessionToken(): Promise<string | null> {
  const dedicated = process.env.GRAFI_SESSION_TOKEN;
  if (dedicated && dedicated.length >= 16) return dedicated;

  const password = process.env.GRAFI_STUDIO_PASSWORD;
  if (!password) return null;
  return sessionTokenFromPassword(password);
}

export async function sessionTokenFromPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`grafi-creative-ops:v1:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Value to put in the cookie after password check. */
export async function mintSessionToken(): Promise<string | null> {
  return expectedSessionToken();
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
