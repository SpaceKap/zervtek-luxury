/** Shared admin session cookie format (Edge + Node safe, no Prisma). */

export const AUTH_COOKIE = "lux_admin";
export const SESSION_TTL_SEC = 60 * 60 * 24 * 7; // 7 days

const FORBIDDEN_SECRETS = new Set([
  "",
  "insecure-dev-secret",
  "generate-with-openssl-rand-hex-32",
  "change-me",
  "change-me-strong-db-password",
]);

const FORBIDDEN_PASSWORDS = new Set([
  "",
  "change-me-admin-password",
  "password",
  "admin",
  "admin123",
]);

export function getSessionSecret(): string {
  return process.env.SESSION_SECRET?.trim() || "";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || "";
}

/** True when secrets are strong enough for production. */
export function authSecretsOk(): { ok: true } | { ok: false; reason: string } {
  const secret = getSessionSecret();
  const password = getAdminPassword();

  if (!secret || FORBIDDEN_SECRETS.has(secret)) {
    return { ok: false, reason: "SESSION_SECRET missing or uses a forbidden placeholder value" };
  }
  if (secret.length < 32) {
    return { ok: false, reason: "SESSION_SECRET must be at least 32 characters" };
  }
  if (!password || FORBIDDEN_PASSWORDS.has(password)) {
    return { ok: false, reason: "ADMIN_PASSWORD missing or uses a forbidden placeholder value" };
  }
  if (password.length < 12) {
    return { ok: false, reason: "ADMIN_PASSWORD must be at least 12 characters" };
  }
  return { ok: true };
}

/** Fail hard in production when secrets are weak. */
export function assertAuthSecretsConfigured(): void {
  if (process.env.NODE_ENV !== "production") return;
  const check = authSecretsOk();
  if (!check.ok) {
    throw new Error(`[auth] Refusing to start: ${check.reason}`);
  }
}

export type ParsedSessionCookie = {
  sid: string;
  exp: number;
  sig: string;
  payload: string;
};

/** Cookie value: `<sid>.<expUnix>.<hmacHex>` */
export function parseSessionCookie(token: string | undefined | null): ParsedSessionCookie | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [sid, expRaw, sig] = parts;
  if (!sid || !expRaw || !sig) return null;
  if (!/^[a-f0-9]{32,128}$/i.test(sid)) return null;
  if (!/^[a-f0-9]{64}$/i.test(sig)) return null;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp <= 0) return null;
  return { sid, exp, sig, payload: `${sid}.${expRaw}` };
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export function isSessionExpired(expUnix: number, nowMs = Date.now()): boolean {
  return nowMs >= expUnix * 1000;
}
