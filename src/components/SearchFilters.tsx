"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, type ReactNode } from "react";
import type { CatalogMake } from "@/lib/vehicles";
import { trackStockFilter } from "@/lib/analytics";
import { STEERINGS } from "@/lib/vehicle-constants";
import { SORTS } from "@/components/StockSort";
import { buildStockHref } from "@/lib/stock";

const SORTS_FOR_CHIPS = SORTS;

type Props = {
  catalog: CatalogMake[];
  /** Resolved make from path (preferred over query). */
  selectedMake?: string;
  selectedModel?: string;
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

export function SearchFilters({
  catalog,
  selectedMake: makeProp = "",
  selectedModel: modelProp = "",
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const selectedMake = makeProp || params.get("make") || "";
  const selectedModel = modelProp || params.get("model") || "";

  const browseHref = useCallback(
    (patch: Record<string, string>) => {
      const make = patch.make !== undefined ? patch.make : selectedMake;
      const model = patch.model !== undefined ? patch.model : selectedModel;
      return buildStockHref({
        make: make || undefined,
        model: make ? model || undefined : undefined,
        q: params.get("q") || undefined,
        bodyType: params.get("bodyType") || undefined,
        transmission: params.get("transmission") || undefined,
        minYear: params.get("minYear") || undefined,
        maxYear: params.get("maxYear") || undefined,
        minMileage: params.get("minMileage") || undefined,
        maxMileage: params.get("maxMileage") || undefined,
        steering: patch.steering !== undefined ? patch.steering : params.get("steering") || undefined,
        minPrice: params.get("minPrice") || undefined,
        maxPrice: params.get("maxPrice") || undefined,
        sort: params.get("sort") || undefined,
        status: params.get("status") || undefined,
      });
    },
    [params, selectedMake, selectedModel],
  );

  const update = useCallback(
    (patch: Record<string, string>) => {
      const href = browseHref(patch);
      trackStockFilter({
        make: patch.make !== undefined ? patch.make || undefined : selectedMake || undefined,
        model: patch.model !== undefined ? patch.model || undefined : selectedModel || undefined,
        steering:
          patch.steering !== undefined
            ? patch.steering || undefined
            : params.get("steering") || undefined,
        sort: params.get("sort") || undefined,
      });
      router.push(href);
    },
    [browseHref, params, router, selectedMake, selectedModel],
  );

  const reset = useCallback(() => {
    router.push("/stock");
  }, [router]);

  const modelOptions = useMemo(() => {
    if (!selectedMake) return [];
    return catalog.find((entry) => entry.make === selectedMake)?.models ?? [];
  }, [catalog, selectedMake]);

  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; clear: Record<string, string> }[] = [];
    const steering = params.get("steering");
    const sort = params.get("sort");

    if (selectedMake) {
      chips.push({ key: "make", label: selectedMake, clear: { make: "", model: "" } });
    }
    if (selectedModel) {
      chips.push({ key: "model", label: selectedModel, clear: { model: "" } });
    }
    if (steering) chips.push({ key: "steering", label: steering, clear: { steering: "" } });
    if (sort && sort !== "newest") {
      chips.push({
        key: "sort",
        label: SORTS_FOR_CHIPS.find((s) => s.value === sort)?.label ?? sort,
        clear: { sort: "newest" },
      });
    }
    return chips;
  }, [params, selectedMake, selectedModel]);

  const hasFilters = activeFilters.length > 0;

  return (
    <section className="stock-filters glass" aria-label="Stock filters">
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
            value={selectedModel}
            disabled={!selectedMake}
            onChange={(e) => update({ model: e.target.value })}
          >
            <option value="">{selectedMake ? "All models" : "Choose make first"}</option>
            {modelOptions.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
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
          <button type="button" className="stock-filters-clear" onClick={reset}>
            Clear all
          </button>
        </div>
      ) : null}
    </section>
  );
}
