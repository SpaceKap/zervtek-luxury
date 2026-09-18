/**
 * Admin inventory search — substring match across listing content.
 * Source / availability fields are intentionally excluded.
 */

const SEARCHABLE_KEYS = [
  "slug",
  "make",
  "model",
  "variant",
  "year",
  "price",
  "mileage",
  "transmission",
  "fuelType",
  "drivetrain",
  "steering",
  "bodyType",
  "engineCc",
  "exteriorColor",
  "interiorColor",
  "location",
  "vin",
  "description",
  "features",
  "status",
  "metaTitle",
  "metaDescription",
  "createdByType",
  "createdByName",
  "featured",
] as const;

type SearchableVehicle = Record<string, unknown>;

function normalizeHaystack(value: unknown): string {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(normalizeHaystack).join(" ");
  if (typeof value === "boolean") return value ? "featured" : "";
  return String(value);
}

/** Lowercase, collapse whitespace, strip punctuation to spaces for partial matches. */
export function normalizeSearchText(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function vehicleSearchBlob(v: SearchableVehicle): string {
  const parts: string[] = [];
  for (const key of SEARCHABLE_KEYS) {
    if (key in v) parts.push(normalizeHaystack(v[key]));
  }
  return normalizeSearchText(parts.join(" "));
}

export function tokenizeSearchQuery(q: string): string[] {
  const n = normalizeSearchText(q);
  if (!n) return [];
  return n.split(" ").filter(Boolean);
}

/** Every query token must appear as a substring somewhere in the listing blob. */
export function vehicleMatchesSearch(v: SearchableVehicle, query: string): boolean {
  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) return true;
  const blob = vehicleSearchBlob(v);
  return tokens.every((t) => blob.includes(t));
}

export function filterVehiclesBySearch<T extends SearchableVehicle>(
  items: T[],
  query: string,
): T[] {
  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) return items;
  return items.filter((v) => {
    const blob = vehicleSearchBlob(v);
    return tokens.every((t) => blob.includes(t));
  });
}
