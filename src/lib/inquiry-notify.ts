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

export type ChannelDelivery = "sent" | "skipped" | "failed" | "unchanged";

export type NotifyResult = {
  /** True when no channel failed (skipped/unchanged/sent all OK). */
  ok: boolean;
  /** True when every attempted channel was skipped and none sent. */
  skippedAll: boolean;
  email: ChannelDelivery;
  webhook: ChannelDelivery;
  error: string | null;
};

export async function sendInquiryEmail(
  payload: InquiryNotification,
): Promise<"sent" | "skipped"> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[inquiry-notify] RESEND_API_KEY unset — skipping email");
    return "skipped";
  }

  const from = process.env.INQUIRY_NOTIFY_FROM?.trim();
  if (!from) {
    console.warn("[inquiry-notify] INQUIRY_NOTIFY_FROM unset — skipping email");
    return "skipped";
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
  return "sent";
}

export async function fireInquiryWebhook(
  payload: InquiryNotification,
): Promise<"sent" | "skipped"> {
  const url = process.env.INQUIRY_WEBHOOK_URL?.trim();
  if (!url) {
    console.warn("[inquiry-notify] INQUIRY_WEBHOOK_URL unset — skipping webhook");
    return "skipped";
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

  return "sent";
}

function channelFromSettled(
  result: PromiseSettledResult<"sent" | "skipped">,
): { delivery: "sent" | "skipped" | "failed"; error: string | null } {
  if (result.status === "fulfilled") {
    return { delivery: result.value, error: null };
  }
  const reason = result.reason;
  const error = reason instanceof Error ? reason.message : String(reason);
  return { delivery: "failed", error };
}

export type NotifyChannels = {
  email?: boolean;
  webhook?: boolean;
};

export async function notifyInquiry(
  payload: InquiryNotification,
  channels: NotifyChannels = { email: true, webhook: true },
): Promise<NotifyResult> {
  const runEmail = channels.email !== false;
  const runWebhook = channels.webhook !== false;

  const tasks: Promise<"sent" | "skipped">[] = [];
  if (runEmail) tasks.push(sendInquiryEmail(payload));
  if (runWebhook) tasks.push(fireInquiryWebhook(payload));

  const settled = await Promise.allSettled(tasks);
  let i = 0;
  const email = runEmail
    ? channelFromSettled(settled[i++]!)
    : { delivery: "unchanged" as const, error: null };
  const webhook = runWebhook
    ? channelFromSettled(settled[i++]!)
    : { delivery: "unchanged" as const, error: null };

  const errors = [email.error, webhook.error].filter(Boolean);
  const ok = email.delivery !== "failed" && webhook.delivery !== "failed";

  const attempted = [email.delivery, webhook.delivery].filter((d) => d !== "unchanged");
  const skippedAll =
    attempted.length > 0 && attempted.every((d) => d === "skipped");

  for (const detail of errors) {
    console.error("[inquiry-notify] failed:", detail);
  }

  return {
    ok,
    skippedAll,
    email: email.delivery,
    webhook: webhook.delivery,
    error: errors.length ? errors.join("; ") : null,
  };
}
