"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, type ReactNode } from "react";
import type { CatalogMake } from "@/lib/vehicles";
import { trackStockFilter } from "@/lib/analytics";
import { STEERINGS } from "@/lib/vehicle-constants";
import { SORTS } from "@/components/StockSort";

const SORTS_FOR_CHIPS = SORTS;

type Props = {
  catalog: CatalogMake[];
};

function FilterField({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`stock-filters-field ${className}`.trim()}>
      {htmlFor ? (
        <label className="stock-filters-label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <span className="stock-filters-label">{label}</span>
      )}
      {children}
    </div>
  );
}

export function SearchFilters({ catalog }: Props) {
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
      next.delete("q");
      trackStockFilter({
        make: next.get("make") || undefined,
        model: next.get("model") || undefined,
        steering: next.get("steering") || undefined,
        sort: next.get("sort") || undefined,
      });
      router.push(`/stock?${next.toString()}`);
    },
    [params, router],
  );

  const reset = useCallback(() => {
    router.push("/stock");
  }, [router]);

  const selectedMake = params.get("make") ?? "";
  const modelOptions = useMemo(() => {
    if (!selectedMake) return [];
    return catalog.find((entry) => entry.make === selectedMake)?.models ?? [];
  }, [catalog, selectedMake]);

  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; clear: Record<string, string> }[] = [];
    const make = params.get("make");
    const model = params.get("model");
    const steering = params.get("steering");
    const sort = params.get("sort");

    if (make) chips.push({ key: "make", label: make, clear: { make: "", model: "" } });
    if (model) chips.push({ key: "model", label: model, clear: { model: "" } });
    if (steering) chips.push({ key: "steering", label: steering, clear: { steering: "" } });
    if (sort && sort !== "newest") {
      chips.push({
        key: "sort",
        label: SORTS_FOR_CHIPS.find((s) => s.value === sort)?.label ?? sort,
        clear: { sort: "newest" },
      });
    }
    return chips;
  }, [params]);

  const hasFilters = activeFilters.length > 0;

  return (
    <section className="stock-filters glass" aria-label="Stock filters">
      <div className="stock-filters-head">
        <div className="stock-filters-head-copy">
          <h2 className="stock-filters-title">Refine search</h2>
          <p className="stock-filters-sub">
            {hasFilters
              ? `${activeFilters.length} filter${activeFilters.length === 1 ? "" : "s"} applied`
              : "Filter by make, model and steering"}
          </p>
        </div>
        {hasFilters ? (
          <button type="button" className="stock-filters-clear" onClick={reset}>
            Clear all
          </button>
        ) : null}
      </div>

      <div className="stock-filters-form">
        <div className="stock-filters-primary">
          <FilterField label="Make" htmlFor="stock-make">
            <select
              className="input"
              id="stock-make"
              value={selectedMake}
              onChange={(e) => {
                const make = e.target.value;
                update(make ? { make, model: "" } : { make: "", model: "" });
              }}
            >
              <option value="">All makes</option>
              {catalog.map(({ make }) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Model" htmlFor="stock-model">
            <select
              className="input"
              id="stock-model"
              value={params.get("model") ?? ""}
              disabled={!selectedMake}
              aria-describedby={selectedMake ? undefined : "stock-model-hint"}
              onChange={(e) => update({ model: e.target.value })}
            >
              <option value="">{selectedMake ? "All models" : "Choose make first"}</option>
              {modelOptions.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            {!selectedMake ? (
              <span className="stock-filters-hint" id="stock-model-hint">
                Select a make to narrow models
              </span>
            ) : null}
          </FilterField>

          <FilterField label="Steering" htmlFor="stock-steering">
            <select
              className="input"
              id="stock-steering"
              value={params.get("steering") ?? ""}
              onChange={(e) => update({ steering: e.target.value })}
            >
              <option value="">Any</option>
              {STEERINGS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </FilterField>
        </div>
      </div>

      {hasFilters ? (
        <div className="stock-filter-chips" aria-label="Active filters">
          {activeFilters.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className="stock-filter-chip"
              onClick={() => update(chip.clear)}
            >
              {chip.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
