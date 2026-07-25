import { prisma } from "@/lib/prisma";
import { buildVehicleSlug, type VehicleSlugParts } from "@/lib/slug";

/** Build a unique make/model/grade-for-sale slug for this vehicle id. */
export async function allocateUniqueVehicleSlug(
  v: VehicleSlugParts & { id: string },
): Promise<string> {
  const base = buildVehicleSlug(v);
  const taken = await prisma.vehicle.findFirst({
    where: { slug: base, NOT: { id: v.id } },
    select: { id: true },
  });
  if (!taken) return base;
  return buildVehicleSlug(v, { uniqueSuffix: v.id.slice(-8) });
}
