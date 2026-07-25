export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * SEO-conscious vehicle slug, e.g.
 * "2023-mercedes-amg-c-class-c43-4matic-wagon-a1b2c3d4"
 * The trailing short id keeps the slug globally unique and human-readable.
 */
export function buildVehicleSlug(v: {
  make: string;
  model: string;
  variant?: string | null;
  year: number;
  id: string;
}): string {
  const parts = [
    String(v.year),
    v.make,
    v.model,
    v.variant || "",
    v.id.slice(-8),
  ]
    .filter(Boolean)
    .map((p) => slugify(p))
    .filter(Boolean);
  return parts.join("-");
}
