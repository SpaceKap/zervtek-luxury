/** Shared stock listing page size (server + client). */
export const STOCK_PAGE_SIZE = 12;

type StockQuery = Record<string, string | undefined>;

/** Build /stock href; omit page=1; drop empty values. */
export function buildStockHref(query: StockQuery): string {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (!value) continue;
    if (key === "page" && value === "1") continue;
    next.set(key, value);
  }
  const qs = next.toString();
  return qs ? `/stock?${qs}` : "/stock";
}

export function parseStockPage(raw: string | undefined): number | null {
  if (raw == null || raw === "") return 1;
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}

export function stockCanonicalPath(page: number, hasIndexableFilters: boolean): string {
  // Faceted filter URLs stay under /stock identity until dedicated hubs own them.
  if (hasIndexableFilters) return "/stock";
  if (page <= 1) return "/stock";
  return `/stock?page=${page}`;
}

export function stockShouldNoIndex(query: {
  q?: string;
  make?: string;
  model?: string;
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
  const faceted = Boolean(
    query.q ||
      query.make ||
      query.model ||
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
  return faceted;
}
