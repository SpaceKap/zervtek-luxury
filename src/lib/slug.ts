export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export type VehicleSlugParts = {
  make: string;
  model: string;
  variant?: string | null;
  id?: string;
};

/**
 * Stock path slug: `{make}/{model}/{grade}-for-sale`
 * e.g. "porsche/911/gt3-rs-for-sale"
 *
 * Pass `uniqueSuffix` (usually last 8 of id) when the base path is already taken.
 */
export function buildVehicleSlug(
  v: VehicleSlugParts,
  opts?: { uniqueSuffix?: string },
): string {
  const make = slugify(v.make) || "make";
  const model = slugify(v.model) || "model";
  const gradeBase = slugify(v.variant || "") || slugify(v.model) || "stock";
  const grade = opts?.uniqueSuffix
    ? `${gradeBase}-${slugify(opts.uniqueSuffix)}-for-sale`
    : `${gradeBase}-for-sale`;
  return `${make}/${model}/${grade}`;
}

/** Public href for a vehicle stock page. */
export function vehicleStockPath(slug: string): string {
  return `/stock/${slug.replace(/^\/+|\/+$/g, "")}`;
}

/** Parse /stock/... path segments into the stored slug (or null if invalid). */
export function slugFromStockPath(segments: string[]): string | null {
  if (segments.length === 1) {
    // Legacy flat slug: "2023-mercedes-amg-…-a1b2c3d4"
    return segments[0] || null;
  }
  if (segments.length === 3) {
    const [make, model, grade] = segments;
    if (!make || !model || !grade || !grade.endsWith("-for-sale")) return null;
    return `${make}/${model}/${grade}`;
  }
  return null;
}
