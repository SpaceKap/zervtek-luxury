import { getAstonMartinModelGuide } from "@/lib/make-hubs/aston-martin";
import { getBentleyModelGuide } from "@/lib/make-hubs/bentley";
import { getFerrariModelGuide } from "@/lib/make-hubs/ferrari";
import { getLamborghiniModelGuide } from "@/lib/make-hubs/lamborghini";
import { getLotusModelGuide } from "@/lib/make-hubs/lotus";
import { getMcLarenModelGuide } from "@/lib/make-hubs/mclaren";
import { getPorscheModelGuide } from "@/lib/make-hubs/porsche";
import { getRollsRoyceModelGuide } from "@/lib/make-hubs/rolls-royce";
import type { MakeModelGuide } from "@/lib/make-hubs/types";

/** Resolve an optional editorial guide for `/stock/{make}/{model}`. */
export function getMakeModelGuide(make: string, model: string): MakeModelGuide | null {
  if (make === "Ferrari") return getFerrariModelGuide(model);
  if (make === "Aston Martin") return getAstonMartinModelGuide(model);
  if (make === "Bentley") return getBentleyModelGuide(model);
  if (make === "Lamborghini") return getLamborghiniModelGuide(model);
  if (make === "Lotus") return getLotusModelGuide(model);
  if (make === "McLaren") return getMcLarenModelGuide(model);
  if (make === "Porsche") return getPorscheModelGuide(model);
  if (make === "Rolls-Royce") return getRollsRoyceModelGuide(model);
  return null;
}
