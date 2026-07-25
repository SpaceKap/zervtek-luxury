import crypto from "crypto";
import { cookies } from "next/headers";

export const AUTH_COOKIE = "lux_admin";

function secret(): string {
  return process.env.SESSION_SECRET || "insecure-dev-secret";
}

/** Deterministic signed token. Cookie is HttpOnly so it can't be read by JS. */
export function signSession(): string {
  return crypto.createHmac("sha256", secret()).update("admin:v1").digest("hex");
}

export function verifySession(token: string | undefined | null): boolean {
  if (!token) return false;
  const expected = signSession();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(AUTH_COOKIE)?.value);
}
