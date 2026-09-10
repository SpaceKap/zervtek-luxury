import { slugify } from "@/lib/slug";

/** Optional editorial spoke under a make hub (`/stock/{make}/{model}`). */
export type MakeModelGuide = {
  /** H1, e.g. "Ferrari 488 GTB for Sale from Japan" */
  title: string;
  /** Meta / OG description */
  description: string;
  /** Short intro under the H1 */
  intro: string;
  /** Buying guide sections below the stock grid */
  sections: { id: string; heading: string; paragraphs: string[] }[];
  faqs?: { q: string; a: string }[];
};

/**
 * Model guides keyed by slugify(model). Empty until content is written —
 * missing guides render like a normal make/model stock browse (no article).
 */
export function lookupModelGuide(
  guides: Record<string, MakeModelGuide>,
  model: string,
): MakeModelGuide | null {
  const key = slugify(model);
  if (!key) return null;
  return guides[key] ?? null;
}
