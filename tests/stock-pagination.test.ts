import { describe, expect, it } from "vitest";
import {
  buildStockHref,
  parseStockPage,
  stockBrowsePath,
  stockCanonicalPath,
  stockShouldNoIndex,
} from "@/lib/stock";

describe("stock pagination helpers", () => {
  it("parses positive integer pages", () => {
    expect(parseStockPage(undefined)).toBe(1);
    expect(parseStockPage("")).toBe(1);
    expect(parseStockPage("2")).toBe(2);
    expect(parseStockPage("0")).toBeNull();
    expect(parseStockPage("-1")).toBeNull();
    expect(parseStockPage("1.5")).toBeNull();
    expect(parseStockPage("abc")).toBeNull();
  });

  it("puts make/model in the path", () => {
    expect(stockBrowsePath("Audi")).toBe("/stock/audi");
    expect(stockBrowsePath("Audi", "RS6")).toBe("/stock/audi/rs6");
    expect(buildStockHref({ make: "Ferrari", page: "2" })).toBe("/stock/ferrari?page=2");
    expect(buildStockHref({ make: "Audi", model: "A4", steering: "RHD" })).toBe(
      "/stock/audi/a4?steering=RHD",
    );
    expect(buildStockHref({ page: "1" })).toBe("/stock");
    expect(buildStockHref({ page: "2" })).toBe("/stock?page=2");
  });

  it("self-canonicalizes pagination; strips extra facets", () => {
    expect(stockCanonicalPath(1, { hasExtraFilters: false })).toBe("/stock");
    expect(stockCanonicalPath(2, { hasExtraFilters: false })).toBe("/stock?page=2");
    expect(stockCanonicalPath(2, { make: "Audi", hasExtraFilters: false })).toBe(
      "/stock/audi?page=2",
    );
    expect(stockCanonicalPath(2, { make: "Audi", hasExtraFilters: true })).toBe("/stock/audi");
  });

  it("noindexes extra facets but not make/model alone", () => {
    expect(stockShouldNoIndex({})).toBe(false);
    expect(stockShouldNoIndex({ sort: "newest" })).toBe(false);
    expect(stockShouldNoIndex({ sort: "price_asc" })).toBe(true);
    expect(stockShouldNoIndex({ steering: "RHD" })).toBe(true);
    expect(stockShouldNoIndex({ q: "amg" })).toBe(true);
  });
});
