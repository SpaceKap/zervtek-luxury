import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  getSessionSecret,
  isSessionExpired,
  parseSessionCookie,
  timingSafeEqualHex,
} from "@/lib/auth-cookie";

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/vehicles",
    "/api/vehicles/:path*",
    "/api/upload",
    "/api/admin/:path*",
  ],
};

function hexFromBuffer(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return hexFromBuffer(sig);
}

/** Edge-safe cookie check (signature + expiry). DB check happens in route handlers. */
async function cookieLooksValid(token: string | undefined): Promise<boolean> {
  const secret = getSessionSecret();
  if (!secret || secret.length < 32) return false;

  const parsed = parseSessionCookie(token);
  if (!parsed) return false;
  if (isSessionExpired(parsed.exp)) return false;

  const expected = await hmacHex(secret, parsed.payload);
  return timingSafeEqualHex(parsed.sig.toLowerCase(), expected.toLowerCase());
}

function isPublicAdminPath(pathname: string): boolean {
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const ok = await cookieLooksValid(token);

  if (ok) return NextResponse.next();

  const isApi =
    pathname.startsWith("/api/vehicles") ||
    pathname.startsWith("/api/upload") ||
    pathname.startsWith("/api/admin");

  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = new URL("/admin/login", req.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}
