import type { Vehicle } from "@prisma/client";
import { parseFeatureList } from "@/lib/features";

/** Explicit public allowlist — new DB fields stay private until added here. */
export const PUBLIC_VEHICLE_FIELDS = [
  "id",
  "slug",
  "make",
  "model",
  "variant",
  "year",
  "registrationMonth",
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
  "images",
  "status",
  "featured",
  "metaTitle",
  "metaDescription",
  "createdAt",
  "updatedAt",
] as const;

export type PublicVehicleField = (typeof PUBLIC_VEHICLE_FIELDS)[number];

export type PublicVehicle = Pick<Vehicle, Exclude<PublicVehicleField, "features">> & {
  features: string[];
};

/** Compact listing card — cover image only, no long description. */
export type PublicVehicleCard = Pick<
  PublicVehicle,
  | "id"
  | "slug"
  | "make"
  | "model"
  | "variant"
  | "year"
  | "price"
  | "mileage"
  | "transmission"
  | "bodyType"
  | "steering"
  | "status"
> & {
  images: string[];
};

export function toPublicVehicle(v: Vehicle): PublicVehicle {
  const out = {} as Record<string, unknown>;
  for (const key of PUBLIC_VEHICLE_FIELDS) {
    if (key === "features") {
      out.features = parseFeatureList(v.features);
    } else {
      out[key] = v[key];
    }
  }
  return out as PublicVehicle;
}

export function toPublicVehicleCard(v: Vehicle | PublicVehicle): PublicVehicleCard {
  const cover = v.images[0] ? [v.images[0]] : [];
  return {
    id: v.id,
    slug: v.slug,
    make: v.make,
    model: v.model,
    variant: v.variant,
    year: v.year,
    price: v.price,
    mileage: v.mileage,
    transmission: v.transmission,
    bodyType: v.bodyType,
    steering: v.steering,
    status: v.status,
    images: cover,
  };
}

export function toPublicVehicles(items: Vehicle[]): PublicVehicle[] {
  return items.map(toPublicVehicle);
}

/** @deprecated Use PUBLIC_VEHICLE_FIELDS allowlist. Kept for call-site greps. */
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
