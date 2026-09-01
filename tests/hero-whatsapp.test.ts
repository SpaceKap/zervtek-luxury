import { describe, expect, it } from "vitest";
import { isWhatsAppDeskOnline } from "@/components/HeroWhatsAppMessage";

describe("isWhatsAppDeskOnline", () => {
  it("is online weekday midday JST", () => {
    // 2026-08-21 Fri 12:00 JST = 2026-08-21T03:00:00.000Z
    expect(isWhatsAppDeskOnline(new Date("2026-08-21T03:00:00.000Z"))).toBe(true);
  });

  it("is away Sunday", () => {
    // 2026-08-23 Sun 12:00 JST
    expect(isWhatsAppDeskOnline(new Date("2026-08-23T03:00:00.000Z"))).toBe(false);
  });

  it("is away before 9 JST", () => {
    // 2026-08-21 Fri 08:30 JST = 2026-08-20T23:30:00.000Z
    expect(isWhatsAppDeskOnline(new Date("2026-08-20T23:30:00.000Z"))).toBe(false);
  });

  it("is away Saturday", () => {
    // 2026-08-22 Sat 12:00 JST = 2026-08-22T03:00:00.000Z
    expect(isWhatsAppDeskOnline(new Date("2026-08-22T03:00:00.000Z"))).toBe(false);
  });

  it("is away at/after 18 JST", () => {
    // 2026-08-21 Fri 18:00 JST = 2026-08-21T09:00:00.000Z
    expect(isWhatsAppDeskOnline(new Date("2026-08-21T09:00:00.000Z"))).toBe(false);
  });
});
