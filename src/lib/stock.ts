import { slugify } from "@/lib/slug";

/** Shared stock listing page size (server + client). */
export const STOCK_PAGE_SIZE = 15;

type StockQuery = Record<string, string | undefined>;

/** Ferrari hub must stay at /stock/ferrari so vehicle detail URLs keep working. */
export function isFerrariMake(make?: string): boolean {
  return slugify(make || "") === "ferrari";
}

/** Path segment(s) for make / make+model browse URLs. */
export function stockBrowsePath(make?: string, model?: string): string {
  if (!make?.trim()) return "/stock";
  const makeSeg = slugify(make);
  if (!makeSeg) return "/stock";
  // Hub owns all Ferrari browse; model is a query param (see buildStockHref).
  if (makeSeg === "ferrari") return "/stock/ferrari";
  if (!model?.trim()) return `/stock/${makeSeg}`;
  const modelSeg = slugify(model);
  return modelSeg ? `/stock/${makeSeg}/${modelSeg}` : `/stock/${makeSeg}`;
}

/**
 * Build stock href: make/model live in the path (`/stock/audi`, `/stock/audi/rs6`);
 * Ferrari model stays on `/stock/ferrari?model=…` so `/stock/ferrari/…/…-for-sale` details work.
 */
export function buildStockHref(query: StockQuery): string {
  const make = query.make?.trim();
  const model = query.model?.trim();
  const path = stockBrowsePath(make, make ? model : undefined);
  const ferrariHub = isFerrariMake(make);

  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (!value) continue;
    if (key === "make") continue;
    if (key === "model") {
      if (ferrariHub) next.set("model", value);
      continue;
    }
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
