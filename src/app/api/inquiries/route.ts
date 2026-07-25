import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: body.phone ? String(body.phone).trim() : null,
        country: body.country ? String(body.country).trim() : null,
        message: body.message ? String(body.message).trim() : null,
        vehicleId: body.vehicleId ? String(body.vehicleId) : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not submit your inquiry. Please try again or contact us directly." },
      { status: 500 },
    );
  }
}
