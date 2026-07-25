import type { Vehicle } from "@prisma/client";

/** Keys stripped from any public-facing vehicle payload. */
export const INTERNAL_VEHICLE_KEYS = [
  "sourceUrl",
  "sourceListingId",
  "sourceType",
  "idempotencyKey",
  "createdByType",
  "createdByName",
  "lastAvailabilityCheckAt",
  "lastAvailabilityResult",
  "consecutiveUnavailableChecks",
  "availabilityCheckLocked",
  "availabilityEvidence",
  "availabilityHttpStatus",
  "statusBeforeUnavailable",
] as const;

export type InternalVehicleKey = (typeof INTERNAL_VEHICLE_KEYS)[number];

export type PublicVehicle = Omit<Vehicle, InternalVehicleKey>;

export function toPublicVehicle(v: Vehicle): PublicVehicle {
  const out = { ...v } as Record<string, unknown>;
  for (const key of INTERNAL_VEHICLE_KEYS) {
    delete out[key];
  }
  return out as PublicVehicle;
}

export function toPublicVehicles(items: Vehicle[]): PublicVehicle[] {
  return items.map(toPublicVehicle);
}
