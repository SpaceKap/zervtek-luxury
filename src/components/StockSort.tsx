"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { trackStockFilter } from "@/lib/analytics";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "year_desc", label: "Year: newest" },
] as const;

export function StockSort() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const updateSort = useCallback(
    (sort: string) => {
      const next = new URLSearchParams(params.toString());
      if (sort && sort !== "newest") next.set("sort", sort);
      else next.delete("sort");
      next.delete("page");
      next.delete("make");
      next.delete("model");
      trackStockFilter({ sort: next.get("sort") || undefined });
      const qs = next.toString();
      const base = pathname.startsWith("/stock") ? pathname : "/stock";
      router.push(qs ? `${base}?${qs}` : base);
    },
    [params, pathname, router],
  );

  return (
    <div className="stock-results-sort">
      <label className="stock-results-sort-label" htmlFor="stock-sort">
        Sort by
      </label>
      <select
        className="input stock-results-sort-select"
        id="stock-sort"
        value={params.get("sort") ?? "newest"}
        onChange={(e) => updateSort(e.target.value)}
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { SORTS };
