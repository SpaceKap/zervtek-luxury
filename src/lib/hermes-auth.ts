import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function hermesToken(): string {
  return process.env.HERMES_VEHICLE_API_TOKEN || "";
}

/** Constant-time bearer token check. Never log the raw token. */
export function verifyHermesBearer(req: NextRequest): boolean {
  const expected = hermesToken();
  if (!expected) return false;
  const header = req.headers.get("authorization") || "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) return false;
  const provided = match[1].trim();
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function hermesUnauthorized() {
  return NextResponse.json(
    { success: false, error: "UNAUTHORIZED" },
    { status: 401 },
  );
}

export function hermesForbiddenHttps() {
  return NextResponse.json(
    { success: false, error: "HTTPS_REQUIRED" },
    { status: 403 },
  );
}

/** Require HTTPS in production (respects x-forwarded-proto behind Caddy). */
export function assertHermesHttps(req: NextRequest): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  if (process.env.HERMES_ALLOW_HTTP === "1") return true;
  const proto = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(":", "");
  return proto === "https";
}

// Simple in-memory sliding-window rate limit (per process).
const hits = new Map<string, number[]>();

export function rateLimitHermes(
  key: string,
  limit = 60,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const prev = (hits.get(key) || []).filter((t) => t > windowStart);
  if (prev.length >= limit) {
    hits.set(key, prev);
    return false;
  }
  prev.push(now);
  hits.set(key, prev);
  return true;
}

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function auditHermes(opts: {
  action: string;
  vehicleId?: string | null;
  ip?: string | null;
  detail?: string | null;
}) {
  try {
    await prisma.hermesAuditLog.create({
      data: {
        action: opts.action,
        vehicleId: opts.vehicleId || null,
        ip: opts.ip || null,
        detail: opts.detail || null,
      },
    });
  } catch {
    // never fail the request on audit write
  }
}

export function hermesGuard(req: NextRequest): NextResponse | null {
  if (!assertHermesHttps(req)) return hermesForbiddenHttps();
  if (!verifyHermesBearer(req)) return hermesUnauthorized();
  const ip = clientIp(req);
  if (!rateLimitHermes(ip)) {
    return NextResponse.json(
      { success: false, error: "RATE_LIMITED" },
      { status: 429 },
    );
  }
  return null;
}

export function safeHermesError(err: unknown, fallback = "INTERNAL_ERROR") {
  if (process.env.NODE_ENV !== "production" && err instanceof Error) {
    return { success: false as const, error: fallback, message: err.message };
  }
  return { success: false as const, error: fallback };
}

export function reviewUrl(vehicleId: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://performance.zervtek.com").replace(
    /\/$/,
    "",
  );
  return `${base}/admin/vehicles/${vehicleId}`;
}
