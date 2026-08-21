import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildInquiryEmailBody,
  buildInquiryEmailSubject,
  buildWebhookPayload,
  fireInquiryWebhook,
  notifyInquiry,
  sendInquiryEmail,
  type InquiryNotification,
} from "@/lib/inquiry-notify";

const basePayload: InquiryNotification = {
  id: "inq_abc123",
  name: "John Doe",
  email: "john@example.com",
  phone: "+81 80 1234 5678",
  country: "United Kingdom",
  message: "Interested in export timing.",
  vehicleId: "veh_1",
  vehicle: {
    make: "McLaren",
    model: "GT",
    variant: "Luxe",
    year: 2022,
    slug: "mclaren/gt/luxe-for-sale",
    price: 32000000,
  },
  formLocation: "vehicle_detail",
  make: null,
  model: null,
  budget: null,
  timeline: null,
  preferredContact: null,
  submittedAt: "2026-08-20T07:00:00.000Z",
  siteUrl: "https://performance.zervtek.com",
};

describe("buildWebhookPayload", () => {
  it("includes vehicle and contact metadata", () => {
    const payload = buildWebhookPayload({
      ...basePayload,
      formLocation: "contact_page",
      make: "Porsche",
      model: "911",
      budget: "¥15M – ¥25M",
      timeline: "1–3 months",
      preferredContact: "WhatsApp",
      vehicle: null,
      vehicleId: null,
    });

    expect(payload).toEqual({
      source: "web",
      sourceId: "inq_abc123",
      customerName: "John Doe",
      email: "john@example.com",
      phone: "+81 80 1234 5678",
      message: "Interested in export timing.",
      metadata: {
        site: "performance.zervtek.com",
        formLocation: "contact_page",
        country: "United Kingdom",
        vehicleId: null,
        vehicle: null,
        make: "Porsche",
        model: "911",
        budget: "¥15M – ¥25M",
        timeline: "1–3 months",
        preferredContact: "WhatsApp",
        submittedAt: "2026-08-20T07:00:00.000Z",
      },
    });
  });
});

describe("buildInquiryEmailSubject", () => {
  it("uses vehicle label when vehicle is linked", () => {
    expect(buildInquiryEmailSubject(basePayload)).toBe("New inquiry — 2022 McLaren GT Luxe");
  });

  it("uses customer name when no vehicle", () => {
    expect(buildInquiryEmailSubject({ ...basePayload, vehicle: null })).toBe(
      "New inquiry — John Doe",
    );
  });
});

describe("buildInquiryEmailBody", () => {
  it("lists core fields and vehicle link", () => {
    const body = buildInquiryEmailBody(basePayload);
    expect(body).toContain("Name: John Doe");
    expect(body).toContain("Form: vehicle_detail");
    expect(body).toContain("2022 McLaren GT Luxe");
    expect(body).toContain("https://performance.zervtek.com/stock/mclaren/gt/luxe-for-sale");
    expect(body).toContain("Inquiry ID: inq_abc123");
  });
});

describe("sendInquiryEmail", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("skips when RESEND_API_KEY is unset", async () => {
    delete process.env.RESEND_API_KEY;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(sendInquiryEmail(basePayload)).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("RESEND_API_KEY unset"),
    );
  });
});

describe("fireInquiryWebhook", () => {
  const originalEnv = process.env;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("skips when INQUIRY_WEBHOOK_URL is unset", async () => {
    delete process.env.INQUIRY_WEBHOOK_URL;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(fireInquiryWebhook(basePayload)).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("INQUIRY_WEBHOOK_URL unset"),
    );
  });

  it("posts payload with bearer auth when configured", async () => {
    process.env.INQUIRY_WEBHOOK_URL = "https://n8n.zervtek.com/webhook/inquiry";
    process.env.INQUIRY_WEBHOOK_SECRET = "test-secret";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => "",
    });
    globalThis.fetch = fetchMock as typeof fetch;

    await fireInquiryWebhook(basePayload);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://n8n.zervtek.com/webhook/inquiry");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toMatchObject({
      "Content-Type": "application/json",
      Authorization: "Bearer test-secret",
    });
    expect(JSON.parse(String(init?.body))).toEqual(buildWebhookPayload(basePayload));
  });
});

describe("notifyInquiry", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.RESEND_API_KEY;
    delete process.env.INQUIRY_WEBHOOK_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("continues when both channels are skipped", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(notifyInquiry(basePayload)).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalled();
  });
});
