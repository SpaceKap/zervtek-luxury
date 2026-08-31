import crypto from "crypto";
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
import { parseCoverIndex, validateHermesMetadata } from "@/lib/hermes-vehicle";
import {
  deleteVehicleImageTree,
  getMediaUrlPrefix,
  maxImages,
  processAndStoreVehicleImage,
} from "@/lib/vehicle-images";

export const runtime = "nodejs";
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

/** List vehicles for Hermes automation (filter by status, source, creator). */
export async function GET(req: NextRequest) {
  const blocked = hermesGuard(req);
  if (blocked) return blocked;

  const ip = clientIp(req);
  const { searchParams } = req.nextUrl;
  const limit = Math.min(200, Math.max(1, Number(searchParams.get("limit") || 50) || 50));
  const offset = Math.max(0, Number(searchParams.get("offset") || 0) || 0);
  const status = searchParams.get("status")?.trim();
  const createdByType = searchParams.get("createdByType")?.trim();
  const sourceListingId = searchParams.get("sourceListingId")?.trim();

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (createdByType) where.createdByType = createdByType;
  if (sourceListingId) where.sourceListingId = sourceListingId;

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      skip: offset,
      take: limit,
    }),
    prisma.vehicle.count({ where }),
  ]);

  await auditHermes({
    action: "vehicle.list",
    ip,
    detail: `count=${vehicles.length};total=${total}`,
  });

  return NextResponse.json({
    success: true,
    total,
    limit,
    offset,
    vehicles: vehicles.map(serializeHermesVehicle),
  });
}

function mediaUrl(mediumPath: string): string {
  const prefix = getMediaUrlPrefix().replace(/\/$/, "");
  return `${prefix}/${mediumPath.replace(/\\/g, "/")}`;
}

export async function POST(req: NextRequest) {
  const blocked = hermesGuard(req);
  if (blocked) return blocked;

  const ip = clientIp(req);
  const idempotencyKey = req.headers.get("idempotency-key")?.trim() || "";
  if (!idempotencyKey) {
    await auditHermes({ action: "vehicle.create.rejected", ip, detail: "missing_idempotency_key" });
    return NextResponse.json(
      {
        success: false,
        error: "VALIDATION_FAILED",
        missingFields: ["Idempotency-Key"],
        invalidFields: {},
      },
      { status: 400 },
    );
  }

  const existing = await prisma.vehicle.findUnique({ where: { idempotencyKey } });
  if (existing) {
    await auditHermes({
      action: "vehicle.create.duplicate",
      ip,
      vehicleId: existing.id,
      detail: "idempotency_hit",
    });
    return NextResponse.json({
      success: true,
      duplicate: true,
      reason: "idempotency_key",
      vehicleId: existing.id,
      status: existing.status,
      reviewUrl: reviewUrl(existing.id),
    });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_MULTIPART" }, { status: 400 });
  }

  const metadataRaw = form.get("metadata");
  let parsedMeta: unknown;
  try {
    parsedMeta = typeof metadataRaw === "string" ? JSON.parse(metadataRaw) : metadataRaw;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "VALIDATION_FAILED",
        missingFields: [],
        invalidFields: { metadata: "Invalid JSON" },
      },
      { status: 400 },
    );
  }

  const validation = validateHermesMetadata(parsedMeta);
  if (!validation.ok || !validation.data) {
    await auditHermes({ action: "vehicle.create.validation_failed", ip, detail: "metadata" });
    return NextResponse.json(
      {
        success: false,
        error: "VALIDATION_FAILED",
        missingFields: validation.missingFields,
        invalidFields: validation.invalidFields,
      },
      { status: 400 },
    );
  }

  if (validation.data.sourceListingId) {
    const bySource = await prisma.vehicle.findFirst({
      where: { sourceListingId: validation.data.sourceListingId },
      orderBy: { createdAt: "asc" },
    });
    if (bySource) {
      await auditHermes({
        action: "vehicle.create.duplicate",
        ip,
        vehicleId: bySource.id,
        detail: "source_listing_id_hit",
      });
      return NextResponse.json({
        success: true,
        duplicate: true,
        reason: "source_listing_id",
        vehicleId: bySource.id,
        status: bySource.status,
        reviewUrl: reviewUrl(bySource.id),
      });
    }
  }

  const files = form.getAll("images").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: "VALIDATION_FAILED",
        missingFields: ["images"],
        invalidFields: {},
      },
      { status: 400 },
    );
  }
  if (files.length > maxImages()) {
    return NextResponse.json(
      {
        success: false,
        error: "VALIDATION_FAILED",
        missingFields: [],
        invalidFields: { images: `Max ${maxImages()} images` },
      },
      { status: 400 },
    );
  }

  const coverIndex = parseCoverIndex(
    (parsedMeta as { coverImageIndex?: unknown }).coverImageIndex,
    files.length,
  );

  const vehicleId = crypto.randomBytes(12).toString("hex");

  try {
    const created = await prisma.vehicle.create({
      data: {
        id: vehicleId,
        slug: `tmp-${vehicleId}`,
        ...validation.data,
        images: [],
        status: "NEEDS_REVIEW",
        featured: false,
        createdByType: "AUTOMATION",
        createdByName: "Hermes",
        idempotencyKey,
        consecutiveUnavailableChecks: 0,
        availabilityCheckLocked: false,
      },
    });

    const seenHashes = new Set<string>();
    let sortOrder = 0;

    for (let i = 0; i < files.length; i++) {
      const bytes = Buffer.from(await files[i].arrayBuffer());
      let processed;
      try {
        processed = await processAndStoreVehicleImage(created.id, bytes);
      } catch (err) {
        const code = err instanceof Error ? err.message : "IMAGE_ERROR";
        console.error("[hermes] image processing failed", { vehicleId: created.id, code });
        await prisma.vehicle.delete({ where: { id: created.id } }).catch(() => {});
        await deleteVehicleImageTree(created.id);
        await auditHermes({
          action: "vehicle.create.image_failed",
          ip,
          vehicleId: created.id,
          detail: code.slice(0, 500),
        });
        const invalidFields: Record<string, string> = {};
        if (code === "IMAGE_TOO_LARGE") invalidFields.images = "File too large";
        else if (code === "INVALID_IMAGE") invalidFields.images = "Non-image or unsupported type";
        else if (
          code.includes("EACCES") ||
          code.includes("EPERM") ||
          code.includes("permission") ||
          code.startsWith("STORAGE_WRITE_FAILED")
        ) {
          invalidFields.images = "Storage permission denied. Check VEHICLE_UPLOAD_DIR ownership";
        } else if (code.startsWith("SHARP_FAILED")) {
          invalidFields.images = "Image processor failed (Sharp)";
        } else {
          invalidFields.images = "Image processing failed";
        }
        return NextResponse.json(
          {
            success: false,
            error: "VALIDATION_FAILED",
            missingFields: [],
            invalidFields,
            // Helps Hermes/ops without exposing paths in production clients that ignore it
            detail: code.slice(0, 300),
          },
          { status: 400 },
        );
      }

      if (seenHashes.has(processed.sha256)) continue;
      seenHashes.add(processed.sha256);

      await prisma.vehicleImage.create({
        data: {
          vehicleId: created.id,
          sortOrder: sortOrder++,
          isCover: i === coverIndex,
          sha256: processed.sha256,
          mimeType: processed.mimeType,
          byteSize: processed.byteSize,
          width: processed.width,
          height: processed.height,
          originalPath: processed.originalPath,
          largePath: processed.largePath,
          mediumPath: processed.mediumPath,
          thumbnailPath: processed.thumbnailPath,
        },
      });
    }

    const media = await prisma.vehicleImage.findMany({
      where: { vehicleId: created.id },
      orderBy: { sortOrder: "asc" },
    });

    if (media.length === 0) {
      await prisma.vehicle.delete({ where: { id: created.id } });
      await deleteVehicleImageTree(created.id);
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_FAILED",
          missingFields: [],
          invalidFields: { images: "No unique valid images" },
        },
        { status: 400 },
      );
    }

    if (!media.some((m) => m.isCover)) {
      await prisma.vehicleImage.update({
        where: { id: media[0].id },
        data: { isCover: true },
      });
      media[0].isCover = true;
    }

    const urls = media
      .slice()
      .sort((a, b) => {
        if (a.isCover && !b.isCover) return -1;
        if (!a.isCover && b.isCover) return 1;
        return a.sortOrder - b.sortOrder;
      })
      .map((m) => mediaUrl(m.mediumPath));

    const slug = await allocateUniqueVehicleSlug(created);
    const updated = await prisma.vehicle.update({
      where: { id: created.id },
      data: { slug, images: urls },
    });

    await auditHermes({
      action: "vehicle.create.ok",
      ip,
      vehicleId: updated.id,
      detail: `images=${media.length}`,
    });

    return NextResponse.json(
      {
        success: true,
        vehicleId: updated.id,
        status: "NEEDS_REVIEW",
        reviewUrl: reviewUrl(updated.id),
      },
      { status: 201 },
    );
  } catch (err) {
    await deleteVehicleImageTree(vehicleId);
    await prisma.vehicle.delete({ where: { id: vehicleId } }).catch(() => {});
    await auditHermes({ action: "vehicle.create.error", ip, vehicleId, detail: "internal" });
    return NextResponse.json(safeHermesError(err), { status: 500 });
  }
}
