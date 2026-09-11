import { slugify } from "@/lib/slug";
import type { VehicleFilters } from "@/lib/vehicles";

/** Shared stock listing page size (server + client). */
export const STOCK_PAGE_SIZE = 15;

export type StockQuery = Record<string, string | undefined>;
export type StockSp = Record<string, string | string[] | undefined>;

export function firstStockParam(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/** All browse facets as strings (for redirects / buildStockHref). */
export function stockQueryFromSp(
  sp: StockSp,
  overrides: { make?: string; model?: string; page?: string | undefined } = {},
): StockQuery {
  return {
    q: firstStockParam(sp.q),
    make: overrides.make !== undefined ? overrides.make : firstStockParam(sp.make),
    model: overrides.model !== undefined ? overrides.model : firstStockParam(sp.model),
    bodyType: firstStockParam(sp.bodyType),
    transmission: firstStockParam(sp.transmission),
    minYear: firstStockParam(sp.minYear),
    maxYear: firstStockParam(sp.maxYear),
    minMileage: firstStockParam(sp.minMileage),
    maxMileage: firstStockParam(sp.maxMileage),
    steering: firstStockParam(sp.steering),
    minPrice: firstStockParam(sp.minPrice),
    maxPrice: firstStockParam(sp.maxPrice),
    sort: firstStockParam(sp.sort),
    status: firstStockParam(sp.status),
    page: overrides.page !== undefined ? overrides.page : firstStockParam(sp.page),
  };
}

export function filtersFromStockSp(
  sp: StockSp,
  make?: string,
  model?: string,
): VehicleFilters {
  const q = stockQueryFromSp(sp, {
    make: make ?? firstStockParam(sp.make),
    model: model ?? firstStockParam(sp.model),
  });
  return {
    q: q.q,
    make: make ?? q.make,
    model: model ?? q.model,
    bodyType: q.bodyType,
    transmission: q.transmission,
    minYear: q.minYear ? Number(q.minYear) : undefined,
    maxYear: q.maxYear ? Number(q.maxYear) : undefined,
    minMileage: q.minMileage ? Number(q.minMileage) : undefined,
    maxMileage: q.maxMileage ? Number(q.maxMileage) : undefined,
    steering: q.steering,
    minPrice: q.minPrice ? Number(q.minPrice) : undefined,
    maxPrice: q.maxPrice ? Number(q.maxPrice) : undefined,
    sort: (q.sort as VehicleFilters["sort"]) ?? "newest",
    status: q.status,
  };
}

export function paginationQueryFromFilters(filters: VehicleFilters): StockQuery {
  return {
    make: filters.make,
    model: filters.model,
    q: filters.q,
    bodyType: filters.bodyType,
    transmission: filters.transmission,
    minYear: filters.minYear != null ? String(filters.minYear) : undefined,
    maxYear: filters.maxYear != null ? String(filters.maxYear) : undefined,
    minMileage: filters.minMileage != null ? String(filters.minMileage) : undefined,
    maxMileage: filters.maxMileage != null ? String(filters.maxMileage) : undefined,
    steering: filters.steering,
    minPrice: filters.minPrice != null ? String(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice != null ? String(filters.maxPrice) : undefined,
    sort: filters.sort && filters.sort !== "newest" ? filters.sort : undefined,
    status: filters.status,
  };
}

/** Path segment(s) for make / make+model browse URLs. */
export function stockBrowsePath(make?: string, model?: string): string {
  if (!make?.trim()) return "/stock";
  const makeSeg = slugify(make);
  if (!makeSeg) return "/stock";
  if (!model?.trim()) return `/stock/${makeSeg}`;
  const modelSeg = slugify(model);
  return modelSeg ? `/stock/${makeSeg}/${modelSeg}` : `/stock/${makeSeg}`;
}

/**
 * Build stock href: make/model live in the path (`/stock/audi`, `/stock/ferrari/488-gtb`);
 * remaining filters stay as query params.
 */
export function buildStockHref(query: StockQuery): string {
  const make = query.make?.trim();
  const model = query.model?.trim();
  const path = stockBrowsePath(make, make ? model : undefined);

  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (!value) continue;
    if (key === "make" || key === "model") continue;
    if (key === "page" && value === "1") continue;
    next.set(key, value);
  }
  const qs = next.toString();
  return qs ? `${path}?${qs}` : path;
}

export function parseStockPage(raw: string | undefined): number | null {
  if (raw == null || raw === "") return 1;
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}

export function stockCanonicalPath(
  page: number,
  opts: { make?: string; model?: string; hasExtraFilters: boolean },
): string {
  return buildStockHref({
    make: opts.make,
    model: opts.model,
    page: opts.hasExtraFilters || page <= 1 ? undefined : String(page),
  });
}

/** Extra facets beyond make/model — those stay noindex. Make/model path pages are indexable. */
export function stockShouldNoIndex(query: {
  q?: string;
  bodyType?: string;
  transmission?: string;
  minYear?: string;
  maxYear?: string;
  minMileage?: string;
  maxMileage?: string;
  steering?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  status?: string;
}): boolean {
  return Boolean(
    query.q ||
      query.bodyType ||
      query.transmission ||
      query.minYear ||
      query.maxYear ||
      query.minMileage ||
      query.maxMileage ||
      query.steering ||
      query.minPrice ||
      query.maxPrice ||
      query.status ||
      (query.sort && query.sort !== "newest"),
  );
}

export function resolveCatalogMake(
  slug: string,
  catalog: { make: string }[],
): string | null {
  const target = slugify(slug);
  if (!target) return null;
  return catalog.find((entry) => slugify(entry.make) === target)?.make ?? null;
}

export function resolveCatalogModel(
  make: string,
  slug: string,
  catalog: { make: string; models: string[] }[],
): string | null {
  const target = slugify(slug);
  if (!target) return null;
  const entry = catalog.find((row) => row.make === make);
  return entry?.models.find((model) => slugify(model) === target) ?? null;
}
