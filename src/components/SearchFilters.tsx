"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { MAKES, BODY_TYPES } from "@/lib/site";
import { trackStockFilter } from "@/lib/analytics";
import { BODY_TYPE_LABELS, BODY_TYPE_VALUES } from "@/lib/vehicle-constants";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "year_desc", label: "Year: newest" },
];

export function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      next.delete("page");
      trackStockFilter({
        search_term: next.get("q") || undefined,
        make: next.get("make") || undefined,
        body_type: next.get("bodyType") || undefined,
        sort: next.get("sort") || undefined,
      });
      router.push(`/stock?${next.toString()}`);
    },
    [params, router],
  );

  const reset = useCallback(() => {
    router.push("/stock");
  }, [router]);

  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string }[] = [];
    const q = params.get("q");
    const make = params.get("make");
    const bodyType = params.get("bodyType");
    const sort = params.get("sort");
    if (q) chips.push({ key: "q", label: `“${q}”` });
    if (make) chips.push({ key: "make", label: make });
    if (bodyType) chips.push({ key: "bodyType", label: bodyType });
    if (sort && sort !== "newest") {
      chips.push({ key: "sort", label: SORTS.find((s) => s.value === sort)?.label ?? sort });
    }
    return chips;
  }, [params]);

  const hasFilters = activeFilters.length > 0;

  return (
    <div className="stock-toolbar-wrap">
      <form
        className="stock-toolbar"
        onSubmit={(e) => {
          e.preventDefault();
          const q = (new FormData(e.currentTarget).get("q") as string) || "";
          update({ q });
        }}
      >
        <div className="stock-toolbar-field stock-toolbar-search">
          <label htmlFor="stock-q">Search</label>
          <div className="stock-search">
            <input
              className="input"
              id="stock-q"
              name="q"
              defaultValue={params.get("q") ?? ""}
              placeholder="Make, model, keyword"
            />
            <button type="submit" className="stock-search-btn" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" />
              </svg>
            </button>
          </div>
        </div>

        <div className="stock-toolbar-field">
          <label htmlFor="stock-make">Make</label>
          <select
            className="input"
            id="stock-make"
            defaultValue={params.get("make") ?? ""}
            onChange={(e) => update({ make: e.target.value })}
          >
            <option value="">All makes</option>
            {MAKES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="stock-toolbar-field">
          <label htmlFor="stock-body">Body type</label>
          <select
            className="input"
            id="stock-body"
            defaultValue={params.get("bodyType") ?? ""}
            onChange={(e) => update({ bodyType: e.target.value })}
          >
            <option value="">All types</option>
            {BODY_TYPE_VALUES.map((b) => (
              <option key={b} value={b}>
                {BODY_TYPE_LABELS[b]}
              </option>
            ))}
            {/* Legacy label values still in older listings */}
            {BODY_TYPES.filter(
              (label) =>
                !BODY_TYPE_VALUES.some((v) => BODY_TYPE_LABELS[v] === label),
            ).map((b) => (
              <option key={`legacy-${b}`} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="stock-toolbar-field">
          <label htmlFor="stock-sort">Sort</label>
          <select
            className="input"
            id="stock-sort"
            defaultValue={params.get("sort") ?? "newest"}
            onChange={(e) => update({ sort: e.target.value })}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {hasFilters ? (
          <button type="button" className="stock-toolbar-clear" onClick={reset}>
            Clear all
          </button>
        ) : null}
      </form>

      {hasFilters ? (
        <div className="stock-filter-chips">
          {activeFilters.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className="stock-filter-chip"
              onClick={() => update({ [chip.key]: chip.key === "sort" ? "newest" : "" })}
            >
              {chip.label}
              <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
