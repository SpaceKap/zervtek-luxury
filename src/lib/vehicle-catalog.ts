import catalogJson from "./vehicle-catalog.json";

export type CatalogMake = {
  make: string;
  country: string;
  models: string[];
};

type CatalogEntry = {
  country: string;
  models: string[];
};

const CATALOG = catalogJson as Record<string, CatalogEntry>;

export const CATALOG_MAKE_MODELS: Record<string, string[]> = Object.fromEntries(
  Object.entries(CATALOG).map(([make, entry]) => [make, entry.models]),
);

export const CATALOG_MAKES = Object.keys(CATALOG);

/** Japan first — this is a Japan export house — then major luxury origins. */
const COUNTRY_ORDER = [
  "Japan",
  "Germany",
  "United Kingdom",
  "Italy",
  "France",
  "United States",
  "Sweden",
  "South Korea",
  "Netherlands",
];

export function countrySortIndex(country: string): number {
  const i = COUNTRY_ORDER.indexOf(country);
  return i === -1 ? COUNTRY_ORDER.length : i;
}

export function getStaticCatalogMakeModels(): CatalogMake[] {
  return CATALOG_MAKES.map((make) => ({
    make,
    country: CATALOG[make]?.country ?? "Other",
    models: CATALOG[make]?.models ?? [],
  }));
}

export function mergeCatalogWithStock(
  stock: CatalogMake[],
  base: CatalogMake[] = getStaticCatalogMakeModels(),
): CatalogMake[] {
  const map = new Map<string, { country: string; models: Set<string> }>();

  for (const entry of base) {
    map.set(entry.make, {
      country: entry.country,
      models: new Set(entry.models),
    });
  }

  for (const entry of stock) {
    const make = entry.make.trim();
    if (!make) continue;
    const existing = map.get(make) ?? {
      country: entry.country || "Other",
      models: new Set<string>(),
    };
    for (const model of entry.models) {
      const trimmed = model.trim();
      if (trimmed) existing.models.add(trimmed);
    }
    map.set(make, existing);
  }

  return Array.from(map.entries())
    .map(([make, value]) => ({
      make,
      country: value.country,
      models: Array.from(value.models).sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => {
      const countryDiff = countrySortIndex(a.country) - countrySortIndex(b.country);
      if (countryDiff !== 0) return countryDiff;
      return a.make.localeCompare(b.make);
    });
}

export function groupCatalogByCountry(catalog: CatalogMake[]): { country: string; makes: CatalogMake[] }[] {
  const groups = new Map<string, CatalogMake[]>();
  for (const entry of catalog) {
    const country = entry.country || "Other";
    const list = groups.get(country) ?? [];
    list.push(entry);
    groups.set(country, list);
  }

  return Array.from(groups.entries())
    .sort((a, b) => countrySortIndex(a[0]) - countrySortIndex(b[0]))
    .map(([country, makes]) => ({
      country,
      makes: makes.sort((a, b) => a.make.localeCompare(b.make)),
    }));
}
