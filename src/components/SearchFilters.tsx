"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, type ReactNode } from "react";
import type { CatalogMake } from "@/lib/vehicles";
import { trackStockFilter } from "@/lib/analytics";
import { BODY_TYPE_LABELS, BODY_TYPE_VALUES, STEERINGS } from "@/lib/vehicle-constants";
import { BODY_TYPES } from "@/lib/site";
import { formatKm } from "@/lib/format";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "year_desc", label: "Year: newest" },
];

type Props = {
  catalog: CatalogMake[];
  yearBounds: { min: number; max: number };
  mileageBounds: { min: number; max: number };
};

const MILEAGE_STEPS_KM = [
  0, 5_000, 10_000, 15_000, 20_000, 30_000, 40_000, 50_000, 75_000, 100_000, 125_000, 150_000,
  200_000,
];

function yearOptions(min: number, max: number): number[] {
  const years: number[] = [];
  for (let y = max; y >= min; y--) years.push(y);
  return years;
}

function mileageOptions(bounds: { min: number; max: number }): number[] {
  const cap = Math.max(bounds.max, ...MILEAGE_STEPS_KM);
  const steps = MILEAGE_STEPS_KM.filter((km) => km <= cap);
  if (bounds.max > steps[steps.length - 1]!) {
    steps.push(bounds.max);
  }
  return steps.filter((km) => km >= bounds.min || km === 0);
}

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

export function SearchFilters({ catalog, yearBounds, mileageBounds }: Props) {
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
        make: next.get("make") || undefined,
        model: next.get("model") || undefined,
        min_year: next.get("minYear") || undefined,
        max_year: next.get("maxYear") || undefined,
        min_mileage: next.get("minMileage") || undefined,
        max_mileage: next.get("maxMileage") || undefined,
        steering: next.get("steering") || undefined,
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

  const selectedMake = params.get("make") ?? "";
  const modelOptions = useMemo(() => {
    if (!selectedMake) return [];
    return catalog.find((entry) => entry.make === selectedMake)?.models ?? [];
  }, [catalog, selectedMake]);

  const years = useMemo(
    () => yearOptions(yearBounds.min, yearBounds.max),
    [yearBounds.min, yearBounds.max],
  );

  const mileages = useMemo(
    () => mileageOptions(mileageBounds),
    [mileageBounds.min, mileageBounds.max],
  );

  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; clear: Record<string, string> }[] = [];
    const make = params.get("make");
    const model = params.get("model");
    const minYear = params.get("minYear");
    const maxYear = params.get("maxYear");
    const minMileage = params.get("minMileage");
    const maxMileage = params.get("maxMileage");
    const steering = params.get("steering");
    const bodyType = params.get("bodyType");
    const sort = params.get("sort");

    if (make) chips.push({ key: "make", label: make, clear: { make: "", model: "" } });
    if (model) chips.push({ key: "model", label: model, clear: { model: "" } });
    if (minYear || maxYear) {
      const range =
        minYear && maxYear
          ? `${minYear}–${maxYear}`
          : minYear
            ? `from ${minYear}`
            : `to ${maxYear}`;
      chips.push({
        key: "year",
        label: `Year ${range}`,
        clear: { minYear: "", maxYear: "" },
      });
    }
    if (minMileage || maxMileage) {
      const range =
        minMileage && maxMileage
          ? `${formatKm(Number(minMileage))}–${formatKm(Number(maxMileage))}`
          : minMileage
            ? `from ${formatKm(Number(minMileage))}`
            : `to ${formatKm(Number(maxMileage))}`;
      chips.push({
        key: "mileage",
        label: range,
        clear: { minMileage: "", maxMileage: "" },
      });
    }
    if (steering) chips.push({ key: "steering", label: steering, clear: { steering: "" } });
    if (bodyType) chips.push({ key: "bodyType", label: bodyType, clear: { bodyType: "" } });
    if (sort && sort !== "newest") {
      chips.push({
        key: "sort",
        label: SORTS.find((s) => s.value === sort)?.label ?? sort,
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
              : "Filter by make, year, mileage and more"}
          </p>
        </div>
        {hasFilters ? (
          <button type="button" className="stock-filters-clear" onClick={reset}>
            Clear all
          </button>
        ) : null}
      </div>

      <form
        className="stock-filters-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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

          <FilterField label="Year">
            <div className="stock-filters-range">
              <select
                className="input"
                id="stock-min-year"
                aria-label="Year from"
                value={params.get("minYear") ?? ""}
                onChange={(e) => update({ minYear: e.target.value })}
              >
                <option value="">Any</option>
                {years.map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </select>
              <span className="stock-filters-range-sep" aria-hidden="true">
                to
              </span>
              <select
                className="input"
                id="stock-max-year"
                aria-label="Year to"
                value={params.get("maxYear") ?? ""}
                onChange={(e) => update({ maxYear: e.target.value })}
              >
                <option value="">Any</option>
                {years.map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </FilterField>

          <FilterField label="Mileage">
            <div className="stock-filters-range">
              <select
                className="input"
                id="stock-min-mileage"
                aria-label="Mileage from"
                value={params.get("minMileage") ?? ""}
                onChange={(e) => update({ minMileage: e.target.value })}
              >
                <option value="">Any</option>
                {mileages.map((km) => (
                  <option key={km} value={String(km)}>
                    {formatKm(km)}
                  </option>
                ))}
              </select>
              <span className="stock-filters-range-sep" aria-hidden="true">
                to
              </span>
              <select
                className="input"
                id="stock-max-mileage"
                aria-label="Mileage to"
                value={params.get("maxMileage") ?? ""}
                onChange={(e) => update({ maxMileage: e.target.value })}
              >
                <option value="">Any</option>
                {mileages.map((km) => (
                  <option key={km} value={String(km)}>
                    {formatKm(km)}
                  </option>
                ))}
              </select>
            </div>
          </FilterField>
        </div>

        <div className="stock-filters-secondary">
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

          <FilterField label="Body type" htmlFor="stock-body">
            <select
              className="input"
              id="stock-body"
              value={params.get("bodyType") ?? ""}
              onChange={(e) => update({ bodyType: e.target.value })}
            >
              <option value="">All types</option>
              {BODY_TYPE_VALUES.map((b) => (
                <option key={b} value={b}>
                  {BODY_TYPE_LABELS[b]}
                </option>
              ))}
              {BODY_TYPES.filter(
                (label) => !BODY_TYPE_VALUES.some((v) => BODY_TYPE_LABELS[v] === label),
              ).map((b) => (
                <option key={`legacy-${b}`} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Sort by" htmlFor="stock-sort" className="stock-filters-sort">
            <select
              className="input"
              id="stock-sort"
              value={params.get("sort") ?? "newest"}
              onChange={(e) => update({ sort: e.target.value })}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </FilterField>
        </div>
      </form>

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
