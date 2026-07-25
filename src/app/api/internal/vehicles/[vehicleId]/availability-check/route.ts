import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  auditHermes,
  clientIp,
  hermesGuard,
  safeHermesError,
} from "@/lib/hermes-auth";
import { AVAILABILITY_RESULTS, type AvailabilityResult } from "@/lib/vehicle-constants";
import { applyAvailabilityResult } from "@/lib/availability";

export const dynamic = "force-dynamic";

function parseResult(v: unknown): AvailabilityResult | null {
  const s = String(v || "").toUpperCase();
  return (AVAILABILITY_RESULTS as readonly string[]).includes(s)
    ? (s as AvailabilityResult)
    : null;
}

/**
 * Hermes reports an availability check result.
 * UNAVAILABLE only hides after 2 consecutive explicit unavailable checks.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ vehicleId: string }> },
) {
  const blocked = hermesGuard(req);
  if (blocked) return blocked;

  const ip = clientIp(req);
  const { vehicleId } = await params;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, error: "INVALID_BODY" },
      { status: 400 },
    );
  }

  const result = parseResult((body as { result?: unknown }).result);
  if (!result) {
    return NextResponse.json(
      {
        success: false,
        error: "VALIDATION_FAILED",
        invalidFields: { result: "Must be AVAILABLE | UNAVAILABLE | UNKNOWN" },
      },
      { status: 400 },
    );
  }

  const checkedAtRaw = (body as { checkedAt?: unknown }).checkedAt;
  const checkedAt = checkedAtRaw ? new Date(String(checkedAtRaw)) : new Date();
  if (Number.isNaN(checkedAt.getTime())) {
    return NextResponse.json(
      {
        success: false,
        error: "VALIDATION_FAILED",
        invalidFields: { checkedAt: "Invalid ISO-8601 timestamp" },
      },
      { status: 400 },
    );
  }

  const httpStatus =
    (body as { httpStatus?: unknown }).httpStatus !== undefined
      ? Number((body as { httpStatus?: unknown }).httpStatus)
      : null;
  const evidence =
    (body as { evidence?: unknown }).evidence != null
      ? String((body as { evidence?: unknown }).evidence)
      : null;
  const errorMessage =
    (body as { errorMessage?: unknown }).errorMessage != null
      ? String((body as { errorMessage?: unknown }).errorMessage)
      : null;

  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return NextResponse.json({ success: false, error: "NOT_FOUND" }, { status: 404 });
    }

    if (vehicle.availabilityCheckLocked) {
      await auditHermes({
        action: "vehicle.availability.locked",
        ip,
        vehicleId,
      });
      return NextResponse.json(
        {
          success: false,
          error: "AVAILABILITY_CHECK_LOCKED",
          vehicleId,
          currentStatus: vehicle.status,
        },
        { status: 409 },
      );
    }

    const previousStatus = vehicle.status;
    const transition = applyAvailabilityResult({
      currentStatus: vehicle.status,
      consecutiveUnavailableChecks: vehicle.consecutiveUnavailableChecks,
      statusBeforeUnavailable: vehicle.statusBeforeUnavailable,
      result,
    });

    await prisma.availabilityCheck.create({
      data: {
        vehicleId,
        checkedAt,
        result,
        httpStatus: Number.isFinite(httpStatus as number) ? (httpStatus as number) : null,
        evidence,
        errorMessage,
        checkedBy: "HERMES",
      },
    });

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        lastAvailabilityCheckAt: checkedAt,
        lastAvailabilityResult: result,
        consecutiveUnavailableChecks: transition.consecutiveUnavailableChecks,
        availabilityEvidence: evidence,
        availabilityHttpStatus: Number.isFinite(httpStatus as number)
          ? (httpStatus as number)
          : null,
        status: transition.nextStatus,
        statusBeforeUnavailable: transition.statusBeforeUnavailable,
      },
    });

    await auditHermes({
      action: "vehicle.availability.ok",
      ip,
      vehicleId,
      detail: `${result}->${updated.status}`,
    });

    return NextResponse.json({
      success: true,
      vehicleId,
      previousStatus,
      currentStatus: updated.status,
      statusChanged: previousStatus !== updated.status,
      consecutiveUnavailableChecks: updated.consecutiveUnavailableChecks,
    });
  } catch (err) {
    return NextResponse.json(safeHermesError(err), { status: 500 });
  }
}
