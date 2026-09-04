import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  AUTH_COOKIE,
  SESSION_TTL_SEC,
  assertAuthSecretsConfigured,
  authSecretsOk,
  getAdminPassword,
  getSessionSecret,
  isSessionExpired,
  parseSessionCookie,
  timingSafeEqualHex,
} from "@/lib/auth-cookie";

export {
  AUTH_COOKIE,
  SESSION_TTL_SEC,
  assertAuthSecretsConfigured,
  authSecretsOk,
} from "@/lib/auth-cookie";

function signPayload(payload: string): string {
  const secret = getSessionSecret();
  if (!secret) throw new Error("[auth] SESSION_SECRET is not set");
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function verifySignature(payload: string, sig: string): boolean {
  try {
    const expected = signPayload(payload);
    return timingSafeEqualHex(sig.toLowerCase(), expected.toLowerCase());
  } catch {
    return false;
  }
}

export function checkPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Create a DB-backed session and return the signed cookie value. */
export async function createSession(): Promise<{ token: string; maxAge: number }> {
  assertAuthSecretsConfigured();
  const sid = crypto.randomBytes(32).toString("hex");
  const maxAge = SESSION_TTL_SEC;
  const expiresAt = new Date(Date.now() + maxAge * 1000);
  const exp = Math.floor(expiresAt.getTime() / 1000);
  const payload = `${sid}.${exp}`;
  const token = `${payload}.${signPayload(payload)}`;

  await prisma.adminSession.create({
    data: { id: sid, expiresAt },
  });

  // Best-effort cleanup of expired rows.
  void prisma.adminSession
    .deleteMany({ where: { expiresAt: { lt: new Date() } } })
    .catch(() => undefined);

  return { token, maxAge };
}

/** Drop session from DB (if present) and return true when cookie looked valid. */
export async function destroySession(token: string | undefined | null): Promise<void> {
  const parsed = parseSessionCookie(token);
  if (!parsed) return;
  if (!verifySignature(parsed.payload, parsed.sig)) return;
  await prisma.adminSession.deleteMany({ where: { id: parsed.sid } }).catch(() => undefined);
}

/**
 * Full auth check: signature + expiry + DB row.
 * Used by server components and API routes.
 */
export async function verifySession(token: string | undefined | null): Promise<boolean> {
  if (process.env.NODE_ENV === "production") {
    const check = authSecretsOk();
    if (!check.ok) return false;
  }

  const parsed = parseSessionCookie(token);
  if (!parsed) return false;
  if (isSessionExpired(parsed.exp)) return false;
  if (!verifySignature(parsed.payload, parsed.sig)) return false;

  try {
    const row = await prisma.adminSession.findUnique({ where: { id: parsed.sid } });
    if (!row) return false;
    if (row.expiresAt.getTime() <= Date.now()) {
      await prisma.adminSession.delete({ where: { id: parsed.sid } }).catch(() => undefined);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(AUTH_COOKIE)?.value);
}

/** Cookie options for login / logout responses. */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

// --- Login rate limit (per process, sliding window) ---

const loginHits = new Map<string, number[]>();

export function rateLimitLogin(
  key: string,
  limit = 8,
  windowMs = 15 * 60 * 1000,
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const prev = (loginHits.get(key) || []).filter((t) => t > windowStart);
  if (prev.length >= limit) {
    loginHits.set(key, prev);
    return false;
  }
  prev.push(now);
  loginHits.set(key, prev);
  return true;
}

export function clientIpFromHeaders(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
