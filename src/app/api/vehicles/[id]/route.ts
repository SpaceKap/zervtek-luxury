import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { allocateUniqueVehicleSlug } from "@/lib/vehicle-slug";
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
import { syncVehicleMediaOrder } from "@/lib/vehicle-images";
import { deleteVehicleById } from "@/lib/vehicle-delete";
import { parseFeatureList } from "@/lib/features";

function toInt(v: unknown): number | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n) : null;
}

function toStrArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === "string") return v.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
  return [];
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      media: { orderBy: { sortOrder: "asc" } },
      availabilityChecks: { orderBy: { checkedAt: "desc" }, take: 20 },
    },
  });
  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ vehicle });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

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
        { error: `Field ${banned} is not accepted.` },
        { status: 400 },
      );
    }
  }

  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = {};

  const strFields = [
    "make",
    "model",
    "variant",
    "location",
    "description",
    "metaTitle",
    "metaDescription",
    "sourceListingId",
    "sourceUrl",
  ] as const;
  for (const f of strFields) {
    if (body[f] !== undefined) data[f] = body[f] === "" ? null : String(body[f]).trim();
  }

  if (body.exteriorColor !== undefined || body.exteriorColour !== undefined) {
    const v = body.exteriorColor ?? body.exteriorColour;
    data.exteriorColor = v === "" || v == null ? null : String(v).trim();
  }
  if (body.interiorColor !== undefined || body.interiorColour !== undefined) {
    const v = body.interiorColor ?? body.interiorColour;
    data.interiorColor = v === "" || v == null ? null : String(v).trim();
  }
  if (body.vin !== undefined || body.frameNumber !== undefined) {
    const v = body.vin ?? body.frameNumber;
    data.vin = v === "" || v == null ? null : String(v).trim();
  }

  if (body.transmission !== undefined) {
    data.transmission =
      normalizeEnumValue(body.transmission, TRANSMISSIONS) ||
      (body.transmission ? String(body.transmission).trim() : null);
  }
  if (body.fuelType !== undefined || body.fuel !== undefined) {
    data.fuelType =
      normalizeEnumValue(body.fuelType ?? body.fuel, FUELS) ||
      String(body.fuelType ?? body.fuel).trim() ||
      null;
  }
  if (body.drivetrain !== undefined) {
    data.drivetrain =
      normalizeEnumValue(body.drivetrain, DRIVETRAINS) ||
      (body.drivetrain ? String(body.drivetrain).trim() : null);
  }
  if (body.steering !== undefined) {
    data.steering =
      normalizeEnumValue(body.steering, STEERINGS) ||
      (body.steering ? String(body.steering).trim() : null);
  }
  if (body.bodyType !== undefined) {
    data.bodyType =
      normalizeEnumValue(body.bodyType, BODY_TYPE_VALUES) ||
      (body.bodyType ? String(body.bodyType).trim() : null);
  }
  if (body.sourceType !== undefined) {
    data.sourceType =
      normalizeEnumValue(body.sourceType, SOURCE_TYPES) ||
      (body.sourceType ? String(body.sourceType).trim() : null);
  }

  for (const f of ["year", "registrationMonth", "price", "mileage", "engineCc"] as const) {
    const key = f === "price" && body.totalPriceJpy !== undefined ? "totalPriceJpy" : f;
    const val = toInt(body[key] ?? body[f]);
    if (val !== undefined) data[f === "price" && key === "totalPriceJpy" ? "price" : f] = val;
  }
  if (body.totalPriceJpy !== undefined && body.price === undefined) {
    const val = toInt(body.totalPriceJpy);
    if (val !== undefined) data.price = val;
  }
  if (body.mileageKm !== undefined && body.mileage === undefined) {
    const val = toInt(body.mileageKm);
    if (val !== undefined) data.mileage = val;
  }
  if (body.registrationYear !== undefined && body.year === undefined) {
    const val = toInt(body.registrationYear);
    if (val !== undefined) data.year = val;
  }

  if (body.features !== undefined) data.features = parseFeatureList(body.features);
  if (body.images !== undefined) data.images = toStrArray(body.images);
  if (body.status !== undefined) {
    const s = String(body.status).toUpperCase();
    if ((VEHICLE_STATUSES as readonly string[]).includes(s)) data.status = s;
  }
  if (body.featured !== undefined) data.featured = Boolean(body.featured);
  if (body.availabilityCheckLocked !== undefined) {
    data.availabilityCheckLocked = Boolean(body.availabilityCheckLocked);
  }

  // Restore from auto-hide
  if (body.restoreFromUnavailable === true && existing.status === "UNAVAILABLE") {
    data.status = existing.statusBeforeUnavailable || "NEEDS_REVIEW";
    data.consecutiveUnavailableChecks = 0;
  }

  const needsSlug =
    body.make !== undefined ||
    body.model !== undefined ||
    body.variant !== undefined ||
    body.year !== undefined ||
    body.registrationYear !== undefined ||
    // Migrate legacy flat slugs to make/model/grade-for-sale on any edit
    !existing.slug.includes("/");

  try {
    let updated = await prisma.vehicle.update({ where: { id }, data });
    if (body.images !== undefined) {
      await syncVehicleMediaOrder(id, updated.images, prisma);
    }
    if (needsSlug) {
      updated = await prisma.vehicle.update({
        where: { id },
        data: { slug: await allocateUniqueVehicleSlug(updated) },
      });
    }
    return NextResponse.json({ vehicle: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteVehicleById(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
