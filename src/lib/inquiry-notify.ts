import { Resend } from "resend";
import { SITE } from "@/lib/site";
import { vehicleStockPath } from "@/lib/slug";

export type InquiryVehicleSummary = {
  make: string;
  model: string;
  variant: string | null;
  year: number;
  slug: string;
  price: number;
};

export type InquiryNotification = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  message: string | null;
  vehicleId: string | null;
  vehicle: InquiryVehicleSummary | null;
  formLocation: string | null;
  make: string | null;
  model: string | null;
  budget: string | null;
  timeline: string | null;
  preferredContact: string | null;
  submittedAt: string;
  siteUrl: string;
};

export type WebhookPayload = {
  source: "web";
  sourceId: string;
  customerName: string;
  email: string;
  phone: string | null;
  message: string | null;
  metadata: {
    site: string;
    formLocation: string | null;
    country: string | null;
    vehicleId: string | null;
    vehicle: InquiryVehicleSummary | null;
    make: string | null;
    model: string | null;
    budget: string | null;
    timeline: string | null;
    preferredContact: string | null;
    submittedAt: string;
  };
};

function siteHost(): string {
  try {
    return new URL(SITE.url).host;
  } catch {
    return SITE.url;
  }
}

function vehicleLabel(vehicle: InquiryVehicleSummary): string {
  const variant = vehicle.variant?.trim();
  const core = variant ? `${vehicle.make} ${vehicle.model} ${variant}` : `${vehicle.make} ${vehicle.model}`;
  return `${vehicle.year} ${core}`.trim();
}

function vehicleUrl(vehicle: InquiryVehicleSummary): string {
  return `${SITE.url}${vehicleStockPath(vehicle.slug)}`;
}

export function buildWebhookPayload(payload: InquiryNotification): WebhookPayload {
  return {
    source: "web",
    sourceId: payload.id,
    customerName: payload.name,
    email: payload.email,
    phone: payload.phone,
    message: payload.message,
    metadata: {
      site: siteHost(),
      formLocation: payload.formLocation,
      country: payload.country,
      vehicleId: payload.vehicleId,
      vehicle: payload.vehicle,
      make: payload.make,
      model: payload.model,
      budget: payload.budget,
      timeline: payload.timeline,
      preferredContact: payload.preferredContact,
      submittedAt: payload.submittedAt,
    },
  };
}

export function buildInquiryEmailSubject(payload: InquiryNotification): string {
  if (payload.vehicle) {
    return `New inquiry — ${vehicleLabel(payload.vehicle)}`;
  }
  return `New inquiry — ${payload.name}`;
}

export function buildInquiryEmailBody(payload: InquiryNotification): string {
  const lines: string[] = [
    "New inquiry received",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
  ];

  if (payload.phone) lines.push(`Phone: ${payload.phone}`);
  if (payload.country) lines.push(`Country: ${payload.country}`);
  if (payload.formLocation) lines.push(`Form: ${payload.formLocation}`);
  if (payload.preferredContact) lines.push(`Preferred contact: ${payload.preferredContact}`);
  if (payload.make) lines.push(`Make: ${payload.make}`);
  if (payload.model) lines.push(`Model: ${payload.model}`);
  if (payload.budget) lines.push(`Budget: ${payload.budget}`);
  if (payload.timeline) lines.push(`Timeline: ${payload.timeline}`);

  if (payload.vehicle) {
    lines.push("", "Vehicle:", vehicleLabel(payload.vehicle));
    lines.push(`Link: ${vehicleUrl(payload.vehicle)}`);
  }

  if (payload.message) {
    lines.push("", "Message:", payload.message);
  }

  lines.push("", `Inquiry ID: ${payload.id}`, `Submitted: ${payload.submittedAt}`);
  return lines.join("\n");
}

export async function sendInquiryEmail(payload: InquiryNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[inquiry-notify] RESEND_API_KEY unset — skipping email");
    return;
  }

  const from = process.env.INQUIRY_NOTIFY_FROM?.trim();
  if (!from) {
    console.warn("[inquiry-notify] INQUIRY_NOTIFY_FROM unset — skipping email");
    return;
  }

  const to = process.env.INQUIRY_NOTIFY_TO?.trim() || SITE.email;
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: payload.email,
    subject: buildInquiryEmailSubject(payload),
    text: buildInquiryEmailBody(payload),
  });

  if (error) {
    throw new Error(error.message || "Resend send failed");
  }

  console.info("[inquiry-notify] email sent", {
    to,
    id: payload.id,
    resendId: data?.id ?? null,
  });
}

export async function fireInquiryWebhook(payload: InquiryNotification): Promise<void> {
  const url = process.env.INQUIRY_WEBHOOK_URL?.trim();
  if (!url) {
    console.warn("[inquiry-notify] INQUIRY_WEBHOOK_URL unset — skipping webhook");
    return;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const secret = process.env.INQUIRY_WEBHOOK_SECRET?.trim();
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(buildWebhookPayload(payload)),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Webhook ${res.status}${body ? `: ${body.slice(0, 200)}` : ""}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

export async function notifyInquiry(payload: InquiryNotification): Promise<void> {
  const results = await Promise.allSettled([
    sendInquiryEmail(payload),
    fireInquiryWebhook(payload),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      const reason = result.reason;
      const detail =
        reason instanceof Error ? reason.message : String(reason);
      console.error("[inquiry-notify] failed:", detail);
    }
  }
}
