import {
  BODY_TYPE_VALUES,
  DRIVETRAINS,
  FUELS,
  SOURCE_TYPES,
  STEERINGS,
  TRANSMISSIONS,
  normalizeEnumValue,
} from "@/lib/vehicle-constants";

export type HermesVehicleMetadata = {
  make: string;
  model: string;
  variant?: string;
  registrationYear: number;
  registrationMonth?: number;
  totalPriceJpy: number;
  mileageKm: number;
  engineCc?: number;
  transmission?: string;
  fuel?: string;
  drivetrain?: string;
  steering?: string;
  bodyType?: string;
  exteriorColour?: string;
  interiorColour?: string;
  location?: string;
  frameNumber?: string;
  description: string;
  features: string[];
  sourceType?: string;
  sourceListingId?: string;
  sourceUrl?: string;
  coverImageIndex?: number;
};

export type HermesValidation = {
  ok: boolean;
  missingFields: string[];
  invalidFields: Record<string, string>;
  data?: ReturnType<typeof mapHermesToDbFields>;
};

function toInt(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n) : null;
}

function toFeatures(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === "string")
    return v
      .split(/[\n,]/)
      .map((x) => x.trim())
      .filter(Boolean);
  return [];
}

/** Explicit field mapping — never spread raw Hermes JSON into Prisma. */
export function mapHermesToDbFields(meta: HermesVehicleMetadata) {
  return {
    make: meta.make.trim(),
    model: meta.model.trim(),
    variant: meta.variant?.trim() || null,
    year: meta.registrationYear,
    registrationMonth: meta.registrationMonth ?? null,
    price: meta.totalPriceJpy,
    mileage: meta.mileageKm,
    engineCc: meta.engineCc ?? null,
    transmission: meta.transmission || null,
    fuelType: meta.fuel || null,
    drivetrain: meta.drivetrain || null,
    steering: meta.steering || null,
    bodyType: meta.bodyType || null,
    exteriorColor: meta.exteriorColour?.trim() || null,
    interiorColor: meta.interiorColour?.trim() || null,
    location: meta.location?.trim() || null,
    vin: meta.frameNumber?.trim() || null,
    description: meta.description.trim(),
    features: meta.features,
    sourceType: meta.sourceType || null,
    sourceListingId: meta.sourceListingId?.trim() || null,
    sourceUrl: meta.sourceUrl?.trim() || null,
  };
}

export function validateHermesMetadata(raw: unknown): HermesValidation {
  const missingFields: string[] = [];
  const invalidFields: Record<string, string> = {};

  if (!raw || typeof raw !== "object") {
    return {
      ok: false,
      missingFields: ["metadata"],
      invalidFields: { metadata: "Must be a JSON object" },
    };
  }

  const body = raw as Record<string, unknown>;
  const make = String(body.make || "").trim();
  const model = String(body.model || "").trim();
  const description = String(body.description || "").trim();
  const year = toInt(body.registrationYear);
  const price = toInt(body.totalPriceJpy);
  const mileage = toInt(body.mileageKm);

  if (!make) missingFields.push("make");
  if (!model) missingFields.push("model");
  if (!description) missingFields.push("description");
  if (year === null) missingFields.push("registrationYear");
  if (price === null) missingFields.push("totalPriceJpy");
  if (mileage === null) missingFields.push("mileageKm");

  if (year !== null && (year < 1980 || year > new Date().getFullYear() + 1)) {
    invalidFields.registrationYear = "Out of allowed range";
  }
  if (price !== null && price < 0) {
    invalidFields.totalPriceJpy = "Must be a non-negative integer";
  }
  if (mileage !== null && mileage < 0) {
    invalidFields.mileageKm = "Must be a non-negative integer";
  }

  const month = body.registrationMonth !== undefined ? toInt(body.registrationMonth) : null;
  if (body.registrationMonth !== undefined && body.registrationMonth !== null && body.registrationMonth !== "") {
    if (month === null || month < 1 || month > 12) {
      invalidFields.registrationMonth = "Must be 1–12";
    }
  }

  const engineCc = body.engineCc !== undefined ? toInt(body.engineCc) : null;
  if (body.engineCc !== undefined && body.engineCc !== null && body.engineCc !== "" && engineCc === null) {
    invalidFields.engineCc = "Must be an integer";
  }

  const transmission = normalizeEnumValue(body.transmission, TRANSMISSIONS);
  if (body.transmission && !transmission) invalidFields.transmission = "Unsupported value";

  const fuel = normalizeEnumValue(body.fuel, FUELS);
  if (body.fuel && !fuel) invalidFields.fuel = "Unsupported value";

  const drivetrain = normalizeEnumValue(body.drivetrain, DRIVETRAINS);
  if (body.drivetrain && !drivetrain) invalidFields.drivetrain = "Unsupported value";

  const steering = normalizeEnumValue(body.steering, STEERINGS);
  if (body.steering && !steering) invalidFields.steering = "Unsupported value";

  const bodyType = normalizeEnumValue(body.bodyType, BODY_TYPE_VALUES);
  if (body.bodyType && !bodyType) invalidFields.bodyType = "Unsupported value";

  const sourceType = normalizeEnumValue(body.sourceType, SOURCE_TYPES);
  if (body.sourceType && !sourceType) invalidFields.sourceType = "Unsupported value";

  if (body.sourceUrl) {
    try {
      const u = new URL(String(body.sourceUrl));
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        invalidFields.sourceUrl = "Must be http(s)";
      }
    } catch {
      invalidFields.sourceUrl = "Invalid URL";
    }
  }

  // Reject fee / breakdown fields if Hermes still sends them
  const banned = [
    "vehiclePriceJpy",
    "inlandTransportJpy",
    "inspectionFeeJpy",
    "exportFeesJpy",
    "otherFeesJpy",
    "marginJpy",
    "vehiclePrice",
  ];
  for (const key of banned) {
    if (body[key] !== undefined) {
      invalidFields[key] = "Fee breakdown fields are not accepted; use totalPriceJpy only";
    }
  }

  if (missingFields.length || Object.keys(invalidFields).length) {
    return { ok: false, missingFields, invalidFields };
  }

  const meta: HermesVehicleMetadata = {
    make,
    model,
    variant: body.variant ? String(body.variant) : undefined,
    registrationYear: year!,
    registrationMonth: month ?? undefined,
    totalPriceJpy: price!,
    mileageKm: mileage!,
    engineCc: engineCc ?? undefined,
    transmission: transmission || undefined,
    fuel: fuel || undefined,
    drivetrain: drivetrain || undefined,
    steering: steering || undefined,
    bodyType: bodyType || undefined,
    exteriorColour: body.exteriorColour ? String(body.exteriorColour) : undefined,
    interiorColour: body.interiorColour ? String(body.interiorColour) : undefined,
    location: body.location ? String(body.location) : undefined,
    frameNumber: body.frameNumber ? String(body.frameNumber) : undefined,
    description,
    features: toFeatures(body.features),
    sourceType: sourceType || undefined,
    sourceListingId: body.sourceListingId ? String(body.sourceListingId) : undefined,
    sourceUrl: body.sourceUrl ? String(body.sourceUrl) : undefined,
    coverImageIndex:
      body.coverImageIndex !== undefined ? toInt(body.coverImageIndex) ?? 0 : 0,
  };

  return {
    ok: true,
    missingFields: [],
    invalidFields: {},
    data: mapHermesToDbFields(meta),
  };
}

export function parseCoverIndex(raw: unknown, imageCount: number): number {
  const n = toInt(raw);
  if (n === null || n < 0 || n >= imageCount) return 0;
  return n;
}
