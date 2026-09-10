import { describe, expect, it } from "vitest";
import {
  buildStockHref,
  parseStockPage,
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

  it("omits page=1 from hrefs", () => {
    expect(buildStockHref({ page: "1" })).toBe("/stock");
    expect(buildStockHref({ page: "2" })).toBe("/stock?page=2");
    expect(buildStockHref({ make: "Ferrari", page: "2" })).toBe(
      "/stock?make=Ferrari&page=2",
    );
  });

  it("self-canonicalizes real pagination without facets", () => {
    expect(stockCanonicalPath(1, false)).toBe("/stock");
    expect(stockCanonicalPath(2, false)).toBe("/stock?page=2");
    expect(stockCanonicalPath(2, true)).toBe("/stock");
  });

  it("noindexes faceted and sort-only URLs", () => {
    expect(stockShouldNoIndex({})).toBe(false);
    expect(stockShouldNoIndex({ sort: "newest" })).toBe(false);
    expect(stockShouldNoIndex({ make: "Ferrari" })).toBe(true);
    expect(stockShouldNoIndex({ sort: "price_asc" })).toBe(true);
    expect(stockShouldNoIndex({ q: "amg" })).toBe(true);
  });
});
