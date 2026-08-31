import type { Vehicle } from "@prisma/client";
import { parseFeatureList } from "@/lib/features";
import {
  BODY_TYPE_VALUES,
  DRIVETRAINS,
  FUELS,
  SOURCE_TYPES,
  STEERINGS,
  TRANSMISSIONS,
  normalizeEnumValue,
} from "@/lib/vehicle-constants";

const HERMES_DELETABLE_STATUSES = new Set(["NEEDS_REVIEW", "DRAFT", "UNAVAILABLE"]);
const HERMES_PATCHABLE_STATUSES = new Set(["NEEDS_REVIEW", "DRAFT", "UNAVAILABLE"]);

const PATCH_BANNED_FIELDS = [
  "vehiclePrice",
  "vehiclePriceJpy",
  "inlandTransportJpy",
  "inspectionFeeJpy",
  "exportFeesJpy",
  "otherFeesJpy",
  "marginJpy",
  "status",
  "featured",
  "images",
  "slug",
  "id",
  "idempotencyKey",
  "createdByType",
  "createdByName",
] as const;

function toInt(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n) : null;
}

export function canHermesDelete(vehicle: Pick<Vehicle, "status">): boolean {
  return HERMES_DELETABLE_STATUSES.has(vehicle.status);
}

export function canHermesPatch(vehicle: Pick<Vehicle, "status">): boolean {
  return HERMES_PATCHABLE_STATUSES.has(vehicle.status);
}

export type HermesPatchResult = {
  ok: boolean;
  invalidFields: Record<string, string>;
  data?: Record<string, unknown>;
};

/** Partial metadata update for Hermes — never accepts status or fee breakdown fields. */
export function buildHermesPatchData(body: Record<string, unknown>): HermesPatchResult {
  const invalidFields: Record<string, string> = {};

  for (const key of PATCH_BANNED_FIELDS) {
    if (body[key] !== undefined) {
      invalidFields[key] = "Field is not accepted on Hermes update";
    }
  }

  const data: Record<string, unknown> = {};

  const strFields = [
    "make",
    "model",
    "variant",
    "location",
    "description",
    "sourceListingId",
    "sourceUrl",
  ] as const;
  for (const f of strFields) {
    if (body[f] !== undefined) {
      data[f] = body[f] === "" || body[f] == null ? null : String(body[f]).trim();
    }
  }

  if (body.exteriorColour !== undefined || body.exteriorColor !== undefined) {
    const v = body.exteriorColour ?? body.exteriorColor;
    data.exteriorColor = v === "" || v == null ? null : String(v).trim();
  }
  if (body.interiorColour !== undefined || body.interiorColor !== undefined) {
    const v = body.interiorColour ?? body.interiorColor;
    data.interiorColor = v === "" || v == null ? null : String(v).trim();
  }
  if (body.frameNumber !== undefined || body.vin !== undefined) {
    const v = body.frameNumber ?? body.vin;
    data.vin = v === "" || v == null ? null : String(v).trim();
  }

  if (body.transmission !== undefined) {
    const v = normalizeEnumValue(body.transmission, TRANSMISSIONS);
    if (body.transmission && !v) invalidFields.transmission = "Unsupported value";
    else data.transmission = v || (body.transmission ? String(body.transmission).trim() : null);
  }
  if (body.fuel !== undefined || body.fuelType !== undefined) {
    const raw = body.fuel ?? body.fuelType;
    const v = normalizeEnumValue(raw, FUELS);
    if (raw && !v) invalidFields.fuel = "Unsupported value";
    else data.fuelType = v || (raw ? String(raw).trim() : null);
  }
  if (body.drivetrain !== undefined) {
    const v = normalizeEnumValue(body.drivetrain, DRIVETRAINS);
    if (body.drivetrain && !v) invalidFields.drivetrain = "Unsupported value";
    else data.drivetrain = v || (body.drivetrain ? String(body.drivetrain).trim() : null);
  }
  if (body.steering !== undefined) {
    const v = normalizeEnumValue(body.steering, STEERINGS);
    if (body.steering && !v) invalidFields.steering = "Unsupported value";
    else data.steering = v || (body.steering ? String(body.steering).trim() : null);
  }
  if (body.bodyType !== undefined) {
    const v = normalizeEnumValue(body.bodyType, BODY_TYPE_VALUES);
    if (body.bodyType && !v) invalidFields.bodyType = "Unsupported value";
    else data.bodyType = v || (body.bodyType ? String(body.bodyType).trim() : null);
  }
  if (body.sourceType !== undefined) {
    const v = normalizeEnumValue(body.sourceType, SOURCE_TYPES);
    if (body.sourceType && !v) invalidFields.sourceType = "Unsupported value";
    else data.sourceType = v || (body.sourceType ? String(body.sourceType).trim() : null);
  }

  if (body.registrationYear !== undefined || body.year !== undefined) {
    const year = toInt(body.registrationYear ?? body.year);
    if (year === null) invalidFields.registrationYear = "Must be an integer";
    else if (year < 1980 || year > new Date().getFullYear() + 1) {
      invalidFields.registrationYear = "Out of allowed range";
    } else {
      data.year = year;
    }
  }

  if (body.registrationMonth !== undefined) {
    const month = toInt(body.registrationMonth);
    if (month === null || month < 1 || month > 12) {
      invalidFields.registrationMonth = "Must be 1–12";
    } else {
      data.registrationMonth = month;
    }
  }

  if (body.totalPriceJpy !== undefined || body.price !== undefined) {
    const price = toInt(body.totalPriceJpy ?? body.price);
    if (price === null || price < 0) invalidFields.totalPriceJpy = "Must be a non-negative integer";
    else data.price = price;
  }

  if (body.mileageKm !== undefined || body.mileage !== undefined) {
    const mileage = toInt(body.mileageKm ?? body.mileage);
    if (mileage === null || mileage < 0) invalidFields.mileageKm = "Must be a non-negative integer";
    else data.mileage = mileage;
  }

  if (body.engineCc !== undefined) {
    const engineCc = toInt(body.engineCc);
    if (engineCc === null) invalidFields.engineCc = "Must be an integer";
    else data.engineCc = engineCc;
  }

  if (body.features !== undefined) {
    data.features = parseFeatureList(body.features);
  }

  if (Object.keys(invalidFields).length) {
    return { ok: false, invalidFields };
  }
  if (!Object.keys(data).length) {
    return { ok: false, invalidFields: { body: "No supported fields to update" } };
  }

  return { ok: true, invalidFields: {}, data };
}

export function applyPriceAdjustPercent(price: number, percent: number): number {
  return Math.max(0, Math.round(price * (1 + percent / 100)));
}
