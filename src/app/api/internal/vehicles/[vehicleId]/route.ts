import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { allocateUniqueVehicleSlug } from "@/lib/vehicle-slug";
import {
  auditHermes,
  clientIp,
  hermesGuard,
  reviewUrl,
  safeHermesError,
} from "@/lib/hermes-auth";
import {
  buildHermesPatchData,
  canHermesDelete,
  canHermesPatch,
} from "@/lib/hermes-vehicle-mutations";
import { deleteVehicleById } from "@/lib/vehicle-delete";

export const dynamic = "force-dynamic";

function serializeHermesVehicle(v: {
  id: string;
  make: string;
  model: string;
  variant: string | null;
  year: number;
  registrationMonth: number | null;
  price: number;
  mileage: number;
  status: string;
  sourceListingId: string | null;
  sourceUrl: string | null;
  idempotencyKey: string | null;
  createdByType: string;
  createdByName: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    vehicleId: v.id,
    make: v.make,
    model: v.model,
    variant: v.variant,
    registrationYear: v.year,
    registrationMonth: v.registrationMonth,
    totalPriceJpy: v.price,
    mileageKm: v.mileage,
    status: v.status,
    sourceListingId: v.sourceListingId,
    sourceUrl: v.sourceUrl,
    idempotencyKey: v.idempotencyKey,
    createdByType: v.createdByType,
    createdByName: v.createdByName,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
    reviewUrl: reviewUrl(v.id),
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ vehicleId: string }> },
) {
  const blocked = hermesGuard(_req);
  if (blocked) return blocked;

  const { vehicleId } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) {
    return NextResponse.json({ success: false, error: "NOT_FOUND" }, { status: 404 });
  }

  await auditHermes({
    action: "vehicle.read",
    ip: clientIp(_req),
    vehicleId,
  });

  return NextResponse.json({ success: true, vehicle: serializeHermesVehicle(vehicle) });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ vehicleId: string }> },
) {
  const blocked = hermesGuard(req);
  if (blocked) return blocked;

  const ip = clientIp(req);
  const { vehicleId } = await params;
  const existing = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "NOT_FOUND" }, { status: 404 });
  }
  if (!canHermesPatch(existing)) {
    await auditHermes({
      action: "vehicle.update.rejected",
      ip,
      vehicleId,
      detail: `status=${existing.status}`,
    });
    return NextResponse.json(
      { success: false, error: "STATUS_LOCKED", status: existing.status },
      { status: 409 },
    );
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ success: false, error: "INVALID_BODY" }, { status: 400 });
  }

  const patch = buildHermesPatchData(body);
  if (!patch.ok || !patch.data) {
    return NextResponse.json(
      {
        success: false,
        error: "VALIDATION_FAILED",
        invalidFields: patch.invalidFields,
      },
      { status: 400 },
    );
  }

  try {
    let updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: patch.data,
    });

    const needsSlug =
      patch.data.make !== undefined ||
      patch.data.model !== undefined ||
      patch.data.variant !== undefined ||
      patch.data.year !== undefined ||
      !updated.slug.includes("/");

    if (needsSlug) {
      updated = await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { slug: await allocateUniqueVehicleSlug(updated) },
      });
    }

    await auditHermes({
      action: "vehicle.update.ok",
      ip,
      vehicleId,
      detail: Object.keys(patch.data).join(","),
    });

    return NextResponse.json({
      success: true,
      vehicle: serializeHermesVehicle(updated),
    });
  } catch (err) {
    await auditHermes({ action: "vehicle.update.error", ip, vehicleId });
    return NextResponse.json(safeHermesError(err), { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ vehicleId: string }> },
) {
  const blocked = hermesGuard(req);
  if (blocked) return blocked;

  const ip = clientIp(req);
  const { vehicleId } = await params;
  const existing = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "NOT_FOUND" }, { status: 404 });
  }
  if (!canHermesDelete(existing)) {
    await auditHermes({
      action: "vehicle.delete.rejected",
      ip,
      vehicleId,
      detail: `status=${existing.status}`,
    });
    return NextResponse.json(
      { success: false, error: "STATUS_LOCKED", status: existing.status },
      { status: 409 },
    );
  }

  try {
    await deleteVehicleById(vehicleId);
    await auditHermes({
      action: "vehicle.delete.ok",
      ip,
      vehicleId,
      detail: existing.sourceListingId || undefined,
    });
    return NextResponse.json({ success: true, vehicleId });
  } catch (err) {
    await auditHermes({ action: "vehicle.delete.error", ip, vehicleId });
    return NextResponse.json(safeHermesError(err, "DELETE_FAILED"), { status: 500 });
  }
}
