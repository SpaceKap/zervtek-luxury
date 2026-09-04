import { describe, expect, it } from "vitest";
import crypto from "crypto";
import {
  authSecretsOk,
  isSessionExpired,
  parseSessionCookie,
  timingSafeEqualHex,
} from "@/lib/auth-cookie";

describe("auth-cookie", () => {
  it("rejects placeholder secrets", () => {
    const prevSecret = process.env.SESSION_SECRET;
    const prevPass = process.env.ADMIN_PASSWORD;
    process.env.SESSION_SECRET = "insecure-dev-secret";
    process.env.ADMIN_PASSWORD = "change-me-admin-password";
    expect(authSecretsOk().ok).toBe(false);
    process.env.SESSION_SECRET = prevSecret;
    process.env.ADMIN_PASSWORD = prevPass;
  });

  it("parses sid.exp.sig tokens", () => {
    const sid = crypto.randomBytes(32).toString("hex");
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = `${sid}.${exp}`;
    const sig = crypto.createHmac("sha256", "x".repeat(32)).update(payload).digest("hex");
    const parsed = parseSessionCookie(`${payload}.${sig}`);
    expect(parsed?.sid).toBe(sid);
    expect(parsed?.exp).toBe(exp);
    expect(parsed?.sig).toBe(sig);
  });

  it("rejects legacy static tokens", () => {
    expect(parseSessionCookie("abcdef0123456789")).toBeNull();
  });

  it("detects expiry", () => {
    expect(isSessionExpired(Math.floor(Date.now() / 1000) - 10)).toBe(true);
    expect(isSessionExpired(Math.floor(Date.now() / 1000) + 60)).toBe(false);
  });

  it("compares hex safely", () => {
    expect(timingSafeEqualHex("ab", "ab")).toBe(true);
    expect(timingSafeEqualHex("ab", "ac")).toBe(false);
    expect(timingSafeEqualHex("ab", "abcd")).toBe(false);
  });
});
