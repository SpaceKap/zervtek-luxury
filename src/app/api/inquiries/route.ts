import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { InquiryNotification } from "@/lib/inquiry-notify";
import {
  deliverInquiryNotification,
  retryPendingInquiryNotifications,
} from "@/lib/inquiry-delivery";
import { SITE } from "@/lib/site";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { isPublicVehicleStatus } from "@/lib/vehicle-constants";

const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  country: 100,
  message: 5000,
  clientRequestId: 80,
} as const;

function trimOrNull(v: unknown, max: number): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s) return null;
  return s.slice(0, max);
}

function clampRequired(v: unknown, max: number): string {
  return String(v || "")
    .trim()
    .slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const limited = rateLimit(`inquiry:${ip}`, 8, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many inquiries. Please wait a minute and try again." },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        },
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // Honeypot — bots fill hidden fields; humans leave empty.
    if (String((body as { companyWebsite?: string }).companyWebsite || "").trim()) {
      return NextResponse.json({ ok: true });
    }

    const name = clampRequired((body as { name?: string }).name, LIMITS.name);
    const email = clampRequired((body as { email?: string }).email, LIMITS.email);

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const clientRequestId = trimOrNull(
      (body as { clientRequestId?: string }).clientRequestId,
      LIMITS.clientRequestId,
    );
    if (clientRequestId) {
      const existing = await prisma.inquiry.findUnique({ where: { clientRequestId } });
      if (existing) {
        if (existing.notifyStatus !== "SENT") {
          try {
            await deliverInquiryNotification(existing.id);
          } catch (err) {
            console.error("[inquiries] notify retry on duplicate failed", {
              id: existing.id,
              err,
            });
          }
        }
        // Drain other pending outbox rows opportunistically.
        void retryPendingInquiryNotifications(3).catch((err) => {
          console.error("[inquiries] outbox drain failed", err);
        });
        return NextResponse.json({ ok: true, id: existing.id, duplicate: true });
      }
    }

    const vehicleId = trimOrNull((body as { vehicleId?: string }).vehicleId, 64);
    const formLocation = trimOrNull((body as { formLocation?: string }).formLocation, 80);
    const make = trimOrNull((body as { make?: string }).make, 80);
    const model = trimOrNull((body as { model?: string }).model, 80);
    const budget = trimOrNull((body as { budget?: string }).budget, 80);
    const timeline = trimOrNull((body as { timeline?: string }).timeline, 80);
    const preferredContact = trimOrNull((body as { preferredContact?: string }).preferredContact, 40);
    const phone = trimOrNull((body as { phone?: string }).phone, LIMITS.phone);
    const country = trimOrNull((body as { country?: string }).country, LIMITS.country);
    const message = trimOrNull((body as { message?: string }).message, LIMITS.message);

    let safeVehicleId: string | null = null;
    let vehicle = null;
    if (vehicleId) {
      const found = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
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
      });
      if (found && isPublicVehicleStatus(found.status)) {
        safeVehicleId = found.id;
        vehicle = {
          make: found.make,
          model: found.model,
          variant: found.variant,
          year: found.year,
          slug: found.slug,
          price: found.price,
        };
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        country,
        message,
        vehicleId: safeVehicleId,
        clientRequestId,
        notifyStatus: "PENDING",
      },
    });

    const notification: InquiryNotification = {
      id: inquiry.id,
      name,
      email,
      phone,
      country,
      message,
      vehicleId: safeVehicleId,
      vehicle,
      formLocation,
      make,
      model,
      budget,
      timeline,
      preferredContact,
      submittedAt: inquiry.createdAt.toISOString(),
      siteUrl: SITE.url,
    };

    try {
      await deliverInquiryNotification(inquiry.id, notification);
    } catch (err) {
      console.error("[inquiries] notification failed after save", { id: inquiry.id, err });
    }

    void retryPendingInquiryNotifications(3).catch((err) => {
      console.error("[inquiries] outbox drain failed", err);
    });

    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "P2002") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error("[inquiries]", err);
    return NextResponse.json(
      { error: "Could not submit your inquiry. Please try again or contact us directly." },
      { status: 500 },
    );
  }
}
