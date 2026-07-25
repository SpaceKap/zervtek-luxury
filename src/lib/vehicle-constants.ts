/** Vehicle statuses used across admin, Hermes, and public filtering. */
export const VEHICLE_STATUSES = [
  "DRAFT",
  "NEEDS_REVIEW",
  "AVAILABLE",
  "RESERVED",
  "SOLD",
  "UNAVAILABLE",
  "ARCHIVED",
] as const;

export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

/** Statuses visible on the public website. */
export const PUBLIC_VEHICLE_STATUSES: VehicleStatus[] = [
  "AVAILABLE",
  "RESERVED",
  "SOLD",
];

export function isPublicVehicleStatus(status: string): boolean {
  return (PUBLIC_VEHICLE_STATUSES as string[]).includes(status);
}

export const TRANSMISSIONS = ["AUTOMATIC", "MANUAL", "DCT", "CVT"] as const;
export type Transmission = (typeof TRANSMISSIONS)[number];

export const FUELS = [
  "PETROL",
  "DIESEL",
  "HYBRID",
  "PLUGIN_HYBRID",
  "ELECTRIC",
] as const;
export type Fuel = (typeof FUELS)[number];

export const DRIVETRAINS = ["FWD", "RWD", "AWD", "FOUR_WD"] as const;
export type Drivetrain = (typeof DRIVETRAINS)[number];

export const STEERINGS = ["RHD", "LHD"] as const;
export type Steering = (typeof STEERINGS)[number];

export const BODY_TYPE_VALUES = [
  "SEDAN",
  "COUPE",
  "CONVERTIBLE",
  "SUV",
  "WAGON",
  "HATCHBACK",
  "VAN",
  "PICKUP",
] as const;
export type BodyTypeValue = (typeof BODY_TYPE_VALUES)[number];

export const SOURCE_TYPES = [
  "AUCTION",
  "DEALER",
  "PRIVATE_SELLER",
  "ZERVTEK_STOCK",
  "PARTNER_STOCK",
  "CONSIGNMENT",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const AVAILABILITY_RESULTS = ["AVAILABLE", "UNAVAILABLE", "UNKNOWN"] as const;
export type AvailabilityResult = (typeof AVAILABILITY_RESULTS)[number];

/** Display labels for admin/public UI (title case). */
export const BODY_TYPE_LABELS: Record<BodyTypeValue, string> = {
  SEDAN: "Sedan",
  COUPE: "Coupe",
  CONVERTIBLE: "Convertible",
  SUV: "SUV",
  WAGON: "Wagon",
  HATCHBACK: "Hatchback",
  VAN: "Van",
  PICKUP: "Pickup",
};

export const TRANSMISSION_LABELS: Record<Transmission, string> = {
  AUTOMATIC: "Automatic",
  MANUAL: "Manual",
  DCT: "DCT",
  CVT: "CVT",
};

export const FUEL_LABELS: Record<Fuel, string> = {
  PETROL: "Petrol",
  DIESEL: "Diesel",
  HYBRID: "Hybrid",
  PLUGIN_HYBRID: "Plug-in Hybrid",
  ELECTRIC: "Electric",
};

const LABEL_TO_ENUM: Record<string, string> = Object.fromEntries([
  ...Object.entries(BODY_TYPE_LABELS).map(([k, v]) => [v.toLowerCase(), k]),
  ...Object.entries(TRANSMISSION_LABELS).map(([k, v]) => [v.toLowerCase(), k]),
  ...Object.entries(FUEL_LABELS).map(([k, v]) => [v.toLowerCase(), k]),
  ["4wd", "FOUR_WD"],
  ["four_wd", "FOUR_WD"],
  ["awd", "AWD"],
  ["fwd", "FWD"],
  ["rwd", "RWD"],
  ["rhd", "RHD"],
  ["lhd", "LHD"],
]);

/** Normalize Hermes/admin enum or legacy label → canonical uppercase enum. */
export function normalizeEnumValue(
  value: unknown,
  allowed: readonly string[],
): string | null {
  if (value === null || value === undefined || value === "") return null;
  const raw = String(value).trim();
  const upper = raw.toUpperCase().replace(/[\s-]+/g, "_");
  if (allowed.includes(upper)) return upper;
  const mapped = LABEL_TO_ENUM[raw.toLowerCase()];
  if (mapped && allowed.includes(mapped)) return mapped;
  return null;
}

/** Human-readable label for stored enum or legacy string. */
export function displayEnum(
  value: string | null | undefined,
  labels: Record<string, string>,
): string {
  if (!value) return "";
  return labels[value] || labels[value.toUpperCase()] || value;
}

export const CREATED_BY_TYPES = ["ADMIN", "AUTOMATION"] as const;
