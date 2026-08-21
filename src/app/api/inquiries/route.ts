import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyInquiry, type InquiryNotification } from "@/lib/inquiry-notify";
import { SITE } from "@/lib/site";

function trimOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const vehicleId = trimOrNull(body.vehicleId);
    const formLocation = trimOrNull(body.formLocation);
    const make = trimOrNull(body.make);
    const model = trimOrNull(body.model);
    const budget = trimOrNull(body.budget);
    const timeline = trimOrNull(body.timeline);
    const preferredContact = trimOrNull(body.preferredContact);
    const phone = trimOrNull(body.phone);
    const country = trimOrNull(body.country);
    const message = trimOrNull(body.message);

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        country,
        message,
        vehicleId,
      },
    });

    const vehicle = vehicleId
      ? await prisma.vehicle.findUnique({
          where: { id: vehicleId },
          select: {
            make: true,
            model: true,
            variant: true,
            year: true,
            slug: true,
            price: true,
          },
        })
      : null;

    const notification: InquiryNotification = {
      id: inquiry.id,
      name,
      email,
      phone,
      country,
      message,
      vehicleId,
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

    await notifyInquiry(notification);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not submit your inquiry. Please try again or contact us directly." },
      { status: 500 },
    );
  }
}
