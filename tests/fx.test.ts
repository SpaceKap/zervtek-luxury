import { describe, expect, it } from "vitest";
import { jpyPerUnitFromForeignPerJpy } from "@/lib/fx";
import { fxIsStale } from "@/lib/fx-meta";
import { convertFromJpy, FALLBACK_JPY_PER_UNIT } from "@/lib/currency";
import {
  buildStockHref,
  filtersFromStockSp,
  paginationQueryFromFilters,
  stockQueryFromSp,
} from "@/lib/stock";

describe("fx frankfurter invert", () => {
  it("converts foreign-per-JPY into JPY-per-unit", () => {
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

describe("fx meta labels", () => {
  it("flags missing/old fetchedAt as stale", () => {
    expect(fxIsStale(null)).toBe(true);
    expect(fxIsStale(Date.now() - 49 * 60 * 60 * 1000)).toBe(true);
    expect(fxIsStale(Date.now() - 1 * 60 * 60 * 1000)).toBe(false);
  });
});

describe("stock query preservation", () => {
  it("keeps q and price facets through pagination helpers", () => {
    const filters = filtersFromStockSp(
      {
        q: "amg",
        minPrice: "1000000",
        transmission: "Automatic",
        steering: "RHD",
      },
      "Ferrari",
    );
    expect(filters.q).toBe("amg");
    expect(filters.minPrice).toBe(1_000_000);
    expect(filters.make).toBe("Ferrari");

    const pageQuery = paginationQueryFromFilters(filters);
    expect(pageQuery.q).toBe("amg");
    expect(buildStockHref({ ...pageQuery, page: "2" })).toContain("q=amg");
    expect(buildStockHref({ ...pageQuery, page: "2" })).toContain("minPrice=1000000");
  });

  it("page=1 redirect keeps facets via stockQueryFromSp", () => {
    const href = buildStockHref(
      stockQueryFromSp(
        {
          q: "gt3",
          minPrice: "5000000",
          steering: "LHD",
          page: "1",
        },
        { make: "Porsche", page: undefined },
      ),
    );
    expect(href).toBe("/stock/porsche?q=gt3&steering=LHD&minPrice=5000000");
  });
});
