import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, destroySession, sessionCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  await destroySession(token);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", sessionCookieOptions(0));
  return res;
}
