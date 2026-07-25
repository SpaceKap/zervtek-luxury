import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { buildVehicleSlug } from "@/lib/slug";
import {
  BODY_TYPE_VALUES,
  DRIVETRAINS,
  FUELS,
  SOURCE_TYPES,
  STEERINGS,
  TRANSMISSIONS,
  VEHICLE_STATUSES,
  normalizeEnumValue,
} from "@/lib/vehicle-constants";
import { buildVehicleMetaDescription, buildVehicleMetaTitle } from "@/lib/seo";

function toInt(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n) : null;
}

function toStrArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === "string")
    return v
      .split(/[\n,]/)
      .map((x) => x.trim())
      .filter(Boolean);
  return [];
}

function normalizeAdmin(body: Record<string, unknown>) {
  const year = toInt(body.year ?? body.registrationYear) ?? new Date().getFullYear();
  const price = toInt(body.price ?? body.totalPriceJpy) ?? 0;
  const mileage = toInt(body.mileage ?? body.mileageKm) ?? 0;

  const transmission =
    normalizeEnumValue(body.transmission, TRANSMISSIONS) ||
    (body.transmission ? String(body.transmission).trim() : null);
  const fuelType =
    normalizeEnumValue(body.fuelType ?? body.fuel, FUELS) ||
    (body.fuelType || body.fuel ? String(body.fuelType || body.fuel).trim() : null);
  const drivetrain =
    normalizeEnumValue(body.drivetrain, DRIVETRAINS) ||
    (body.drivetrain ? String(body.drivetrain).trim() : null);
  const steering =
    normalizeEnumValue(body.steering, STEERINGS) ||
    (body.steering ? String(body.steering).trim() : null);
  const bodyType =
    normalizeEnumValue(body.bodyType, BODY_TYPE_VALUES) ||
    (body.bodyType ? String(body.bodyType).trim() : null);
  const sourceType =
    normalizeEnumValue(body.sourceType, SOURCE_TYPES) ||
    (body.sourceType ? String(body.sourceType).trim() : null);

  let status = body.status ? String(body.status).trim().toUpperCase() : "DRAFT";
  if (!(VEHICLE_STATUSES as readonly string[]).includes(status)) status = "DRAFT";

  const description = String(body.description || "").trim();
  const make = String(body.make || "").trim();
  const model = String(body.model || "").trim();
  const variant = body.variant ? String(body.variant).trim() : null;

  let metaTitle = body.metaTitle ? String(body.metaTitle).trim() : null;
  let metaDescription = body.metaDescription ? String(body.metaDescription).trim() : null;
  if (!metaTitle) {
    metaTitle = buildVehicleMetaTitle({ year, make, model, variant });
  }
  if (!metaDescription) {
    metaDescription = buildVehicleMetaDescription({
      year,
      make,
      model,
      variant,
      description,
      mileage,
      price,
    });
  }

  return {
    make,
    model,
    variant,
    year,
    registrationMonth: toInt(body.registrationMonth),
    price,
    mileage,
    transmission,
    fuelType,
    drivetrain,
    steering,
    bodyType,
    engineCc: toInt(body.engineCc),
    exteriorColor: body.exteriorColor || body.exteriorColour
      ? String(body.exteriorColor || body.exteriorColour).trim()
      : null,
    interiorColor: body.interiorColor || body.interiorColour
      ? String(body.interiorColor || body.interiorColour).trim()
      : null,
    location: body.location ? String(body.location).trim() : null,
    vin: body.vin || body.frameNumber ? String(body.vin || body.frameNumber).trim() : null,
    description,
    features: toStrArray(body.features),
    images: toStrArray(body.images),
    status,
    featured: Boolean(body.featured),
    metaTitle,
    metaDescription,
    sourceType,
    sourceListingId: body.sourceListingId ? String(body.sourceListingId).trim() : null,
    sourceUrl: body.sourceUrl ? String(body.sourceUrl).trim() : null,
    availabilityCheckLocked: Boolean(body.availabilityCheckLocked),
  };
}

/** Admin-only list (includes source / availability fields). */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const items = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  // Reject fee breakdown fields
  for (const banned of [
    "vehiclePrice",
    "vehiclePriceJpy",
    "inlandTransportJpy",
    "inspectionFeeJpy",
    "exportFeesJpy",
    "otherFeesJpy",
    "marginJpy",
  ]) {
    if (body[banned] !== undefined) {
      return NextResponse.json(
        { error: `Field ${banned} is not accepted. Use total price (price) only.` },
        { status: 400 },
      );
    }
  }

  const data = normalizeAdmin(body);
  if (!data.make || !data.model || !data.description) {
    return NextResponse.json(
      { error: "Make, model and description are required." },
      { status: 400 },
    );
  }

  try {
    const created = await prisma.vehicle.create({
      data: {
        ...data,
        slug: `tmp-${crypto.randomUUID()}`,
        createdByType: "ADMIN",
        createdByName: "Admin",
      },
    });
    const slug = buildVehicleSlug(created);
    const updated = await prisma.vehicle.update({
      where: { id: created.id },
      data: { slug },
    });
    return NextResponse.json({ vehicle: updated }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create vehicle";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
