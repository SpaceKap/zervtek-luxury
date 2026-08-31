import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  auditHermes,
  clientIp,
  hermesGuard,
  reviewUrl,
  safeHermesError,
} from "@/lib/hermes-auth";
import {
  applyPriceAdjustPercent,
  canHermesPatch,
} from "@/lib/hermes-vehicle-mutations";

export const dynamic = "force-dynamic";

type PriceAdjustBody = {
  percent: number;
  vehicleIds?: string[];
  sourceListingIds?: string[];
  status?: string;
  createdByType?: string;
  dryRun?: boolean;
};

/**
 * Adjust totalPriceJpy by a percentage for Hermes-managed listings.
 * Example: percent=8 increases each price by 8%.
 */
export async function POST(req: NextRequest) {
  const blocked = hermesGuard(req);
  if (blocked) return blocked;

  const ip = clientIp(req);
  const body = (await req.json().catch(() => null)) as PriceAdjustBody | null;
  if (!body || typeof body.percent !== "number" || !Number.isFinite(body.percent)) {
    return NextResponse.json(
      { success: false, error: "VALIDATION_FAILED", invalidFields: { percent: "Required number" } },
      { status: 400 },
    );
  }

  const dryRun = Boolean(body.dryRun);
  const where: Record<string, unknown> = {};

  if (body.vehicleIds?.length) {
    where.id = { in: body.vehicleIds };
  }
  if (body.sourceListingIds?.length) {
    where.sourceListingId = { in: body.sourceListingIds };
  }
  if (body.status) where.status = body.status;
  if (body.createdByType) where.createdByType = body.createdByType;

  if (!Object.keys(where).length) {
    return NextResponse.json(
      {
        success: false,
        error: "VALIDATION_FAILED",
        invalidFields: { filter: "Provide vehicleIds, sourceListingIds, and/or status filter" },
      },
      { status: 400 },
    );
  }

  try {
    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        price: true,
        status: true,
        sourceListingId: true,
      },
    });

    const updated: Array<{
      vehicleId: string;
      sourceListingId: string | null;
      previousPriceJpy: number;
      totalPriceJpy: number;
      reviewUrl: string;
    }> = [];
    const skipped: Array<{ vehicleId: string; reason: string }> = [];

    for (const v of vehicles) {
      if (!canHermesPatch(v)) {
        skipped.push({ vehicleId: v.id, reason: `status=${v.status}` });
        continue;
      }

      const nextPrice = applyPriceAdjustPercent(v.price, body.percent);
      if (!dryRun) {
        await prisma.vehicle.update({
          where: { id: v.id },
          data: { price: nextPrice },
        });
      }

      updated.push({
        vehicleId: v.id,
        sourceListingId: v.sourceListingId,
        previousPriceJpy: v.price,
        totalPriceJpy: nextPrice,
        reviewUrl: reviewUrl(v.id),
      });
    }

    await auditHermes({
      action: dryRun ? "vehicle.price_adjust.dry_run" : "vehicle.price_adjust.ok",
      ip,
      detail: `percent=${body.percent};updated=${updated.length};skipped=${skipped.length}`,
    });

    return NextResponse.json({
      success: true,
      dryRun,
      percent: body.percent,
      updated,
      skipped,
    });
  } catch (err) {
    await auditHermes({ action: "vehicle.price_adjust.error", ip });
    return NextResponse.json(safeHermesError(err), { status: 500 });
  }
}
