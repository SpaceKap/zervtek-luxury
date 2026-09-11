import { getAstonMartinModelGuide } from "@/lib/make-hubs/aston-martin";
import { getFerrariModelGuide } from "@/lib/make-hubs/ferrari";
import type { MakeModelGuide } from "@/lib/make-hubs/types";

/** Resolve an optional editorial guide for `/stock/{make}/{model}`. */
export function getMakeModelGuide(make: string, model: string): MakeModelGuide | null {
  if (make === "Ferrari") return getFerrariModelGuide(model);
  if (make === "Aston Martin") return getAstonMartinModelGuide(model);
  return null;
}
