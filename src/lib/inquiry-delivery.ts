import type { Inquiry, Prisma, Vehicle } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  notifyInquiry,
  type InquiryNotification,
  type InquiryVehicleSummary,
} from "@/lib/inquiry-notify";
import { SITE } from "@/lib/site";
import { isPublicVehicleStatus } from "@/lib/vehicle-constants";

export const INQUIRY_NOTIFY_MAX_ATTEMPTS = 8;
const CLAIM_TTL_MS = 120_000;

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

type ChannelStatus = "PENDING" | "SENT" | "FAILED" | "SKIPPED";

type InquiryWithVehicle = Inquiry & {
  vehicle: Pick<
    Vehicle,
    "id" | "make" | "model" | "variant" | "year" | "slug" | "price" | "status"
  > | null;
};

export type InquiryNotifyPayloadSnapshot = {
  formLocation: string | null;
  make: string | null;
  model: string | null;
  budget: string | null;
  timeline: string | null;
  preferredContact: string | null;
  vehicle: InquiryVehicleSummary | null;
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

function parsePayloadSnapshot(raw: unknown): InquiryNotifyPayloadSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const vehicleRaw = o.vehicle;
  let vehicle: InquiryVehicleSummary | null = null;
  if (vehicleRaw && typeof vehicleRaw === "object") {
    const v = vehicleRaw as Record<string, unknown>;
    if (
      typeof v.make === "string" &&
      typeof v.model === "string" &&
      typeof v.year === "number" &&
      typeof v.slug === "string" &&
      (typeof v.price === "number" || v.price === null)
    ) {
      vehicle = {
        make: v.make,
        model: v.model,
        variant: typeof v.variant === "string" ? v.variant : v.variant === null ? null : null,
        year: v.year,
        slug: v.slug,
        price: v.price as number | null,
      };
    }
  }
  return {
    formLocation: typeof o.formLocation === "string" ? o.formLocation : null,
    make: typeof o.make === "string" ? o.make : null,
    model: typeof o.model === "string" ? o.model : null,
    budget: typeof o.budget === "string" ? o.budget : null,
    timeline: typeof o.timeline === "string" ? o.timeline : null,
    preferredContact: typeof o.preferredContact === "string" ? o.preferredContact : null,
    vehicle,
  };
}

export function snapshotFromNotification(
  n: InquiryNotification,
): InquiryNotifyPayloadSnapshot {
  return {
    formLocation: n.formLocation,
    make: n.make,
    model: n.model,
    budget: n.budget,
    timeline: n.timeline,
    preferredContact: n.preferredContact,
    vehicle: n.vehicle,
  };
}

export function notificationFromInquiry(row: InquiryWithVehicle): InquiryNotification {
  const snap = parsePayloadSnapshot(row.notifyPayload);
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    message: row.message,
    vehicleId: row.vehicleId,
    vehicle: snap?.vehicle ?? vehicleSummary(row.vehicle),
    formLocation: snap?.formLocation ?? null,
    make: snap?.make ?? null,
    model: snap?.model ?? null,
    budget: snap?.budget ?? null,
    timeline: snap?.timeline ?? null,
    preferredContact: snap?.preferredContact ?? null,
    submittedAt: row.createdAt.toISOString(),
    siteUrl: SITE.url,
  };
}

function nextRetryAt(attempts: number, from = new Date()): Date {
  const idx = Math.min(Math.max(attempts, 1), BACKOFF_MS.length) - 1;
  return new Date(from.getTime() + BACKOFF_MS[idx]);
}

function mergeChannel(
  previous: string,
  delivery: "sent" | "skipped" | "failed" | "unchanged",
): ChannelStatus {
  if (delivery === "unchanged") {
    return (previous as ChannelStatus) || "PENDING";
  }
  if (delivery === "sent") return "SENT";
  if (delivery === "skipped") return "SKIPPED";
  return "FAILED";
}

function overallStatus(email: ChannelStatus, webhook: ChannelStatus): string {
  if (email === "FAILED" || webhook === "FAILED") return "FAILED";
  if (email === "PENDING" || webhook === "PENDING") return "PENDING";
  if (email === "SKIPPED" && webhook === "SKIPPED") return "SKIPPED";
  // Mix of SENT/SKIPPED → delivered as far as configured channels go.
  return "SENT";
}

function channelNeedsRetry(status: string): boolean {
  return status === "PENDING" || status === "FAILED";
}

/** Claim one inquiry for delivery. Returns false if another worker holds the lock. */
export async function claimInquiryForNotify(inquiryId: string): Promise<boolean> {
  const now = new Date();
  const lockedUntil = new Date(now.getTime() + CLAIM_TTL_MS);
  const result = await prisma.inquiry.updateMany({
    where: {
      id: inquiryId,
      notifyStatus: { in: ["PENDING", "FAILED"] },
      notifyAttempts: { lt: INQUIRY_NOTIFY_MAX_ATTEMPTS },
      OR: [{ notifyLockedUntil: null }, { notifyLockedUntil: { lte: now } }],
    },
    data: { notifyLockedUntil: lockedUntil },
  });
  return result.count === 1;
}

export async function markInquiryNotifyResult(
  inquiryId: string,
  previous: {
    notifyAttempts: number;
    notifyEmailStatus: string;
    notifyWebhookStatus: string;
  },
  result: {
    ok: boolean;
    skippedAll: boolean;
    email: "sent" | "skipped" | "failed" | "unchanged";
    webhook: "sent" | "skipped" | "failed" | "unchanged";
    error: string | null;
  },
): Promise<void> {
  const attempts = previous.notifyAttempts + 1;
  const now = new Date();
  const emailStatus = mergeChannel(previous.notifyEmailStatus, result.email);
  const webhookStatus = mergeChannel(previous.notifyWebhookStatus, result.webhook);
  const status = result.skippedAll
    ? "SKIPPED"
    : overallStatus(emailStatus, webhookStatus);
  const done = status === "SENT" || status === "SKIPPED";
  const exhausted = attempts >= INQUIRY_NOTIFY_MAX_ATTEMPTS;

  await prisma.inquiry.update({
    where: { id: inquiryId },
    data: {
      notifyStatus: status,
      notifyEmailStatus: emailStatus,
      notifyWebhookStatus: webhookStatus,
      notifyAttempts: attempts,
      notifyLastError: result.ok ? null : (result.error ?? "Notification failed").slice(0, 500),
      notifyLastAttemptAt: now,
      notifyNextRetryAt: done || exhausted ? null : nextRetryAt(attempts, now),
      notifyLockedUntil: null,
    },
  });
}

/** Deliver (or re-deliver) staff notification; persists per-channel outcome. */
export async function deliverInquiryNotification(
  inquiryId: string,
  payload?: InquiryNotification,
): Promise<{ ok: boolean; error: string | null; claimed: boolean }> {
  const claimed = await claimInquiryForNotify(inquiryId);
  if (!claimed) {
    return { ok: false, error: "Already claimed or not retryable", claimed: false };
  }

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
  if (!row) return { ok: false, error: "Inquiry not found", claimed: true };

  // Persist payload snapshot on first delivery if provided.
  if (payload && !row.notifyPayload) {
    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { notifyPayload: snapshotFromNotification(payload) as Prisma.InputJsonValue },
    });
  }

  const notification = payload
    ? { ...payload, id: row.id }
    : notificationFromInquiry(row);

  const runEmail = channelNeedsRetry(row.notifyEmailStatus);
  const runWebhook = channelNeedsRetry(row.notifyWebhookStatus);

  if (!runEmail && !runWebhook) {
    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: {
        notifyStatus: overallStatus(
          row.notifyEmailStatus as ChannelStatus,
          row.notifyWebhookStatus as ChannelStatus,
        ),
        notifyLockedUntil: null,
        notifyNextRetryAt: null,
      },
    });
    return { ok: true, error: null, claimed: true };
  }

  const result = await notifyInquiry(notification, {
    email: runEmail,
    webhook: runWebhook,
  });

  await markInquiryNotifyResult(
    row.id,
    {
      notifyAttempts: row.notifyAttempts,
      notifyEmailStatus: row.notifyEmailStatus,
      notifyWebhookStatus: row.notifyWebhookStatus,
    },
    result,
  );

  return { ok: result.ok, error: result.error, claimed: true };
}

/** Drain due outbox rows — used by enquiry POST and the scheduled worker. */
export async function retryPendingInquiryNotifications(limit = 10): Promise<number> {
  const now = new Date();
  const stalePendingBefore = new Date(now.getTime() - 120_000);
  const due = await prisma.inquiry.findMany({
    where: {
      notifyAttempts: { lt: INQUIRY_NOTIFY_MAX_ATTEMPTS },
      OR: [{ notifyLockedUntil: null }, { notifyLockedUntil: { lte: now } }],
      AND: [
        {
          OR: [
            {
              notifyStatus: "FAILED",
              OR: [{ notifyNextRetryAt: null }, { notifyNextRetryAt: { lte: now } }],
            },
            {
              notifyStatus: "PENDING",
              notifyAttempts: 0,
              createdAt: { lte: stalePendingBefore },
            },
          ],
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
