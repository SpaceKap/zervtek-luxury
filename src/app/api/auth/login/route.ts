import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  assertAuthSecretsConfigured,
  checkPassword,
  clientIpFromHeaders,
  createSession,
  rateLimitLogin,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    assertAuthSecretsConfigured();
  } catch {
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 503 },
    );
  }

  const ip = clientIpFromHeaders(req.headers);
  if (!rateLimitLogin(ip)) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = String((body as { password?: unknown }).password || "");

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const { token, maxAge } = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, sessionCookieOptions(maxAge));
  return res;
}
