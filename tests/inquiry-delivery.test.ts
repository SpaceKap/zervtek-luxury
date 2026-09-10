import { describe, expect, it } from "vitest";
import {
  notificationFromInquiry,
  snapshotFromNotification,
} from "@/lib/inquiry-delivery";
import type { InquiryNotification } from "@/lib/inquiry-notify";

const base: InquiryNotification = {
  id: "inq_1",
  name: "Jane",
  email: "jane@example.com",
  phone: null,
  country: "UK",
  message: "Hello",
  vehicleId: null,
  vehicle: null,
  formLocation: "contact_page",
  make: "Audi",
  model: "RS6",
  budget: "¥15M – ¥25M",
  timeline: "1–3 months",
  preferredContact: "WhatsApp",
  submittedAt: "2026-09-10T00:00:00.000Z",
  siteUrl: "https://performance.zervtek.com",
};

describe("inquiry notify payload snapshot", () => {
  it("round-trips contact form extras for retries", () => {
    const snap = snapshotFromNotification(base);
    const rebuilt = notificationFromInquiry({
      id: "inq_1",
      name: "Jane",
      email: "jane@example.com",
      phone: null,
      country: "UK",
      message: "Hello",
      vehicleId: null,
      clientRequestId: null,
      notifyStatus: "FAILED",
      notifyEmailStatus: "SENT",
      notifyWebhookStatus: "FAILED",
      notifyAttempts: 1,
      notifyLastError: "Webhook 500",
      notifyLastAttemptAt: null,
      notifyNextRetryAt: null,
      notifyLockedUntil: null,
      notifyPayload: snap,
      createdAt: new Date("2026-09-10T00:00:00.000Z"),
      vehicle: null,
    } as never);

    expect(rebuilt.formLocation).toBe("contact_page");
    expect(rebuilt.make).toBe("Audi");
    expect(rebuilt.model).toBe("RS6");
    expect(rebuilt.budget).toBe("¥15M – ¥25M");
    expect(rebuilt.timeline).toBe("1–3 months");
    expect(rebuilt.preferredContact).toBe("WhatsApp");
  });
});
