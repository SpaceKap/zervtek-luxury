import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  auditHermes,
  clientIp,
  hermesGuard,
  reviewUrl,
  safeHermesError,
} from "@/lib/hermes-auth";
import { canHermesDelete } from "@/lib/hermes-vehicle-mutations";
import { deleteVehicleById } from "@/lib/vehicle-delete";

export const dynamic = "force-dynamic";

type DedupeBody = {
  status?: string;
  createdByType?: string;
  dryRun?: boolean;
};

/**
 * Remove duplicate automation listings that share the same sourceListingId.
 * Keeps the oldest record in each group.
 */
export async function POST(req: NextRequest) {
  const blocked = hermesGuard(req);
  if (blocked) return blocked;

  const ip = clientIp(req);
  const body = (await req.json().catch(() => ({}))) as DedupeBody;
  const status = body.status?.trim() || "NEEDS_REVIEW";
  const createdByType = body.createdByType?.trim() || "AUTOMATION";
  const dryRun = Boolean(body.dryRun);

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status,
        createdByType,
        sourceListingId: { not: null },
      },
      orderBy: [{ sourceListingId: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        sourceListingId: true,
        createdAt: true,
        status: true,
      },
    });

    const kept: Array<{ vehicleId: string; sourceListingId: string; reviewUrl: string }> = [];
    const deleted: Array<{ vehicleId: string; sourceListingId: string }> = [];
    const skipped: Array<{ vehicleId: string; sourceListingId: string; reason: string }> = [];

    let currentSource: string | null = null;
    for (const v of vehicles) {
      const sourceListingId = v.sourceListingId!;
      if (sourceListingId !== currentSource) {
        currentSource = sourceListingId;
        kept.push({
          vehicleId: v.id,
          sourceListingId,
          reviewUrl: reviewUrl(v.id),
        });
        continue;
      }

      if (!canHermesDelete(v)) {
        skipped.push({
          vehicleId: v.id,
          sourceListingId,
          reason: `status=${v.status}`,
        });
        continue;
      }

      if (!dryRun) {
        await deleteVehicleById(v.id);
      }
      deleted.push({ vehicleId: v.id, sourceListingId });
    }

    await auditHermes({
      action: dryRun ? "vehicle.dedupe.dry_run" : "vehicle.dedupe.ok",
      ip,
      detail: `kept=${kept.length};deleted=${deleted.length};skipped=${skipped.length}`,
    });

    return NextResponse.json({
      success: true,
      dryRun,
      kept,
      deleted,
      skipped,
    });
  } catch (err) {
    await auditHermes({ action: "vehicle.dedupe.error", ip });
    return NextResponse.json(safeHermesError(err), { status: 500 });
  }
}
