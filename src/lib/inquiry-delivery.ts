import type { Inquiry, Vehicle } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  notifyInquiry,
  type InquiryNotification,
  type InquiryVehicleSummary,
} from "@/lib/inquiry-notify";
import { SITE } from "@/lib/site";
import { isPublicVehicleStatus } from "@/lib/vehicle-constants";

export const INQUIRY_NOTIFY_MAX_ATTEMPTS = 8;

/** Backoff after attempt N (1-based), milliseconds. */
const BACKOFF_MS = [
  0,
  60_000,
  5 * 60_000,
  30 * 60_000,
  2 * 60 * 60_000,
  6 * 60 * 60_000,
  24 * 60 * 60_000,
  24 * 60 * 60_000,
] as const;

type InquiryWithVehicle = Inquiry & {
  vehicle: Pick<
    Vehicle,
    "id" | "make" | "model" | "variant" | "year" | "slug" | "price" | "status"
  > | null;
};

function vehicleSummary(
  vehicle: InquiryWithVehicle["vehicle"],
): InquiryVehicleSummary | null {
  if (!vehicle || !isPublicVehicleStatus(vehicle.status)) return null;
  return {
    make: vehicle.make,
    model: vehicle.model,
    variant: vehicle.variant,
    year: vehicle.year,
    slug: vehicle.slug,
    price: vehicle.price,
  };
}

export function notificationFromInquiry(row: InquiryWithVehicle): InquiryNotification {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    message: row.message,
    vehicleId: row.vehicleId,
    vehicle: vehicleSummary(row.vehicle),
    formLocation: null,
    make: null,
    model: null,
    budget: null,
    timeline: null,
    preferredContact: null,
    submittedAt: row.createdAt.toISOString(),
    siteUrl: SITE.url,
  };
}

function nextRetryAt(attempts: number, from = new Date()): Date {
  const idx = Math.min(Math.max(attempts, 1), BACKOFF_MS.length) - 1;
  return new Date(from.getTime() + BACKOFF_MS[idx]);
}

export async function markInquiryNotifyResult(
  inquiryId: string,
  result: { ok: boolean; error: string | null },
  previousAttempts: number,
): Promise<void> {
  const attempts = previousAttempts + 1;
  const now = new Date();
  await prisma.inquiry.update({
    where: { id: inquiryId },
    data: {
      notifyStatus: result.ok ? "SENT" : "FAILED",
      notifyAttempts: attempts,
      notifyLastError: result.ok ? null : (result.error ?? "Notification failed").slice(0, 500),
      notifyLastAttemptAt: now,
      notifyNextRetryAt: result.ok || attempts >= INQUIRY_NOTIFY_MAX_ATTEMPTS
        ? null
        : nextRetryAt(attempts, now),
    },
  });
}

/** Deliver (or re-deliver) staff notification for one inquiry; persists outcome. */
export async function deliverInquiryNotification(
  inquiryId: string,
  payload?: InquiryNotification,
): Promise<{ ok: boolean; error: string | null }> {
  const row = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
    include: {
      vehicle: {
        select: {
          id: true,
          make: true,
          model: true,
          variant: true,
          year: true,
          slug: true,
          price: true,
          status: true,
        },
      },
    },
  });
  if (!row) return { ok: false, error: "Inquiry not found" };

  const notification = payload
    ? { ...payload, id: row.id }
    : notificationFromInquiry(row);

  const result = await notifyInquiry(notification);
  await markInquiryNotifyResult(row.id, result, row.notifyAttempts);
  return { ok: result.ok, error: result.error };
}

/** Opportunistic outbox drain — safe to call on each enquiry POST. */
export async function retryPendingInquiryNotifications(limit = 5): Promise<number> {
  const now = new Date();
  const stalePendingBefore = new Date(now.getTime() - 120_000);
  const due = await prisma.inquiry.findMany({
    where: {
      notifyAttempts: { lt: INQUIRY_NOTIFY_MAX_ATTEMPTS },
      OR: [
        {
          notifyStatus: "FAILED",
          OR: [{ notifyNextRetryAt: null }, { notifyNextRetryAt: { lte: now } }],
        },
        // Stuck PENDING (process died mid-delivery) — wait 2m so create path can finish first.
        {
          notifyStatus: "PENDING",
          notifyAttempts: 0,
          createdAt: { lte: stalePendingBefore },
        },
      ],
    },
    orderBy: [{ notifyNextRetryAt: "asc" }, { createdAt: "asc" }],
    take: limit,
    select: { id: true },
  });

  let delivered = 0;
  for (const row of due) {
    const result = await deliverInquiryNotification(row.id);
    if (result.ok) delivered += 1;
  }
  return delivered;
}
