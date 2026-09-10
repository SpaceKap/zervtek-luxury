import { describe, expect, it } from "vitest";
import { jpyPerUnitFromForeignPerJpy } from "@/lib/fx";
import { convertFromJpy, FALLBACK_JPY_PER_UNIT } from "@/lib/currency";

describe("fx frankfurter invert", () => {
  it("converts foreign-per-JPY into JPY-per-unit", () => {
    // 1 JPY = 0.006666… USD → ~150 JPY per 1 USD
    expect(jpyPerUnitFromForeignPerJpy(1 / 150)).toBeCloseTo(150, 6);
    expect(jpyPerUnitFromForeignPerJpy(1 / 163)).toBeCloseTo(163, 6);
  });

  it("rejects non-positive rates", () => {
    expect(() => jpyPerUnitFromForeignPerJpy(0)).toThrow();
    expect(() => jpyPerUnitFromForeignPerJpy(-1)).toThrow();
  });
});

describe("convertFromJpy with rates", () => {
  it("uses provided rates", () => {
    const rates = { ...FALLBACK_JPY_PER_UNIT, USD: 100, EUR: 200 };
    expect(convertFromJpy(1_000_000, "USD", rates)).toBe(10_000);
    expect(convertFromJpy(1_000_000, "EUR", rates)).toBe(5_000);
    expect(convertFromJpy(1_000_000, "JPY", rates)).toBe(1_000_000);
  });
});
