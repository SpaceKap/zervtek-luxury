import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auditHermes, clientIp, hermesGuard } from "@/lib/hermes-auth";

export const dynamic = "force-dynamic";

/**
 * Vehicles due for Hermes availability checks.
 * Query: ?limit=50&offset=0
 */
export async function GET(req: NextRequest) {
  const blocked = hermesGuard(req);
  if (blocked) return blocked;

  const ip = clientIp(req);
  const { searchParams } = req.nextUrl;
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 50) || 50));
  const offset = Math.max(0, Number(searchParams.get("offset") || 0) || 0);

  // Due: never checked, or checked > 12h ago
  const dueBefore = new Date(Date.now() - 12 * 60 * 60 * 1000);

  const vehicles = await prisma.vehicle.findMany({
    where: {
      createdByType: "AUTOMATION",
      sourceUrl: { not: null },
      availabilityCheckLocked: false,
      status: { notIn: ["ARCHIVED", "SOLD"] },
      OR: [
        { lastAvailabilityCheckAt: null },
        { lastAvailabilityCheckAt: { lt: dueBefore } },
      ],
    },
    orderBy: [{ lastAvailabilityCheckAt: "asc" }, { createdAt: "asc" }],
    skip: offset,
    take: limit,
    select: {
      id: true,
      make: true,
      model: true,
      variant: true,
      sourceUrl: true,
      status: true,
      lastAvailabilityCheckAt: true,
    },
  });

  await auditHermes({
    action: "vehicle.check_queue",
    ip,
    detail: `count=${vehicles.length}`,
  });

  return NextResponse.json({
    vehicles: vehicles.map((v) => ({
      vehicleId: v.id,
      make: v.make,
      model: v.model,
      variant: v.variant,
      sourceUrl: v.sourceUrl,
      currentStatus: v.status,
      lastAvailabilityCheckAt: v.lastAvailabilityCheckAt,
    })),
  });
}
