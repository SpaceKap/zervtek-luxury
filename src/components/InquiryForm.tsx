"use client";

import { useState } from "react";
import {
  COUNTRY_NAMES,
  DEFAULT_PHONE_COUNTRY,
  getPhoneDial,
  PHONE_COUNTRIES,
} from "@/lib/phone-codes";
import { trackGenerateLead } from "@/lib/analytics";
import { SITE } from "@/lib/site";

type Props = {
  vehicleId?: string;
  vehicleName?: string;
  /** Where this form lives — used as the `form_location` analytics property. */
  formLocation?: string;
  compact?: boolean;
  embedded?: boolean;
};

export function InquiryForm({
  vehicleId,
  vehicleName,
  formLocation = "site_general",
  compact,
  embedded,
}: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [phoneCountry, setPhoneCountry] = useState(DEFAULT_PHONE_COUNTRY);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const phoneNumber = String(data.phoneNumber || "").trim();
    const dial = getPhoneDial(phoneCountry);
    const phone = phoneNumber ? `${dial} ${phoneNumber}`.trim() : undefined;

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone,
          country: data.country,
          message: data.message,
          vehicleId,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to send");
      setStatus("ok");
      // Only a server-accepted inquiry counts as a lead.
      trackGenerateLead({
        formLocation,
        vehicleId,
        vehicleName,
        destinationCountry: String(data.country || "") || undefined,
      });
      form.reset();
      setPhoneCountry(DEFAULT_PHONE_COUNTRY);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "ok") {
    return (
      <div className={embedded ? "inquiry-success embedded" : "glass"} style={embedded ? undefined : { padding: 28, borderRadius: 0, textAlign: "center" }}>
        <h3 className="heading" style={{ fontSize: embedded ? 20 : 24, margin: "0 0 8px" }}>
          Thank you
        </h3>
        <p className="muted" style={{ margin: 0 }}>
          Your inquiry has been received. A {SITE.name} specialist will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`stack inquiry-form${embedded ? " inquiry-form-embedded" : ""}`}
      style={{ gap: embedded ? 12 : 16 }}
    >
      {vehicleName && !embedded ? (
        <p className="muted" style={{ margin: 0 }}>
          Enquiring about: <strong style={{ color: "var(--ink)" }}>{vehicleName}</strong>
        </p>
      ) : null}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Full name *</label>
          <input className="input" id="name" name="name" required placeholder="John Doe" />
        </div>
        <div className="field">
          <label htmlFor="email">Email *</label>
          <input className="input" id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="phoneNumber">Phone</label>
        <div className="phone-input">
          <select
            className="input phone-code"
            id="phoneCountry"
            name="phoneCountry"
            value={phoneCountry}
            onChange={(e) => setPhoneCountry(e.target.value)}
            aria-label="Country code"
          >
            {PHONE_COUNTRIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.dial} {item.label}
              </option>
            ))}
          </select>
          <input
            className="input phone-number"
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="Phone number"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="country">Destination country</label>
        <select className="input" id="country" name="country" defaultValue="">
          <option value="">Select country</option>
          {COUNTRY_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          className="textarea"
          id="message"
          name="message"
          placeholder={compact || embedded ? "Questions, budget, timeline..." : "Tell us about your dream car, budget and timeline..."}
          style={embedded ? { minHeight: 72 } : undefined}
        />
      </div>

      {status === "error" ? (
        <p style={{ color: "var(--crimson)", margin: 0 }}>{error}</p>
      ) : null}

      <button className="btn btn-gold" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
