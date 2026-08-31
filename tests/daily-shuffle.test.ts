import { describe, expect, it } from "vitest";
import {
  dailySortKey,
  getDailySeedKey,
  pickDailyItems,
} from "@/lib/daily-shuffle";

const items = [
  { id: "a", name: "A" },
  { id: "b", name: "B" },
  { id: "c", name: "C" },
  { id: "d", name: "D" },
  { id: "e", name: "E" },
];

describe("daily-shuffle", () => {
  it("uses JST calendar date as seed key", () => {
    const key = getDailySeedKey(new Date("2026-08-31T14:00:00Z"));
    expect(key).toBe("2026-08-31");
  });

  it("returns stable order for the same day", () => {
    const first = pickDailyItems(items, 3, "2026-08-31");
    const second = pickDailyItems(items, 3, "2026-08-31");
    expect(first.map((i) => i.id)).toEqual(second.map((i) => i.id));
  });

  it("changes order on a different day", () => {
    const dayA = pickDailyItems(items, 3, "2026-08-31").map((i) => i.id);
    const dayB = pickDailyItems(items, 3, "2026-09-01").map((i) => i.id);
    expect(dayA).not.toEqual(dayB);
  });

  it("returns all items when pool is smaller than limit", () => {
    expect(pickDailyItems(items.slice(0, 2), 6, "2026-08-31")).toHaveLength(2);
  });

  it("sort keys are deterministic per id and seed", () => {
    expect(dailySortKey("abc", "2026-08-31")).toBe(dailySortKey("abc", "2026-08-31"));
    expect(dailySortKey("abc", "2026-08-31")).not.toBe(dailySortKey("xyz", "2026-08-31"));
  });
});
