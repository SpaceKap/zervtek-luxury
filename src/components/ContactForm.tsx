"use client";

import { useMemo, useState } from "react";
import {
  COUNTRY_NAMES,
  DEFAULT_PHONE_COUNTRY,
  getPhoneDial,
  PHONE_COUNTRIES,
} from "@/lib/phone-codes";
import {
  CONTACT_BUDGETS,
  CONTACT_METHODS,
  CONTACT_TIMELINES,
  SITE,
  whatsappHref,
} from "@/lib/site";
import type { CatalogMake } from "@/lib/vehicles";
import { groupCatalogByCountry } from "@/lib/vehicle-catalog";
import { trackContact, trackGenerateLead } from "@/lib/analytics";

type Props = {
  catalog?: CatalogMake[];
};

export function ContactForm({ catalog = [] }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [phoneCountry, setPhoneCountry] = useState(DEFAULT_PHONE_COUNTRY);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const makeGroups = useMemo(() => groupCatalogByCountry(catalog), [catalog]);

  const modelOptions = useMemo(() => {
    if (!make) return [];
    const match = catalog.find(
      (entry) => entry.make.toLowerCase() === make.toLowerCase(),
    );
    return match?.models ?? [];
  }, [catalog, make]);

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
          message: data.message || null,
          formLocation: "contact_page",
          make: make || null,
          model: model || null,
          budget: data.budget ? String(data.budget) : null,
          timeline: data.timeline ? String(data.timeline) : null,
          preferredContact: data.preferredContact ? String(data.preferredContact) : null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to send");
      setStatus("ok");
      trackGenerateLead({
        formLocation: "contact_page",
        destinationCountry: String(data.country || "") || undefined,
      });
      form.reset();
      setPhoneCountry(DEFAULT_PHONE_COUNTRY);
      setMake("");
      setModel("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "ok") {
    return (
      <div className="glass info-card" style={{ textAlign: "center", padding: 36 }}>
        <h3 className="heading" style={{ fontSize: 24, margin: "0 0 8px" }}>
          Thank you
        </h3>
        <p className="muted" style={{ margin: 0 }}>
          We&apos;ve received your inquiry and will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <div className="glass info-card contact-card">
      <div className="contact-card-head">
        <h3 className="heading info-card-title">Send us a message</h3>
        <p className="muted">Tell us what you&apos;re looking for and we&apos;ll get back with options.</p>
      </div>

      <form onSubmit={onSubmit} className="stack" style={{ gap: 16 }}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="contact-name">Name *</label>
            <input className="input" id="contact-name" name="name" required placeholder="John Doe" />
          </div>
          <div className="field">
            <label htmlFor="contact-email">Email *</label>
            <input
              className="input"
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="contact-phone">Phone / WhatsApp *</label>
          <div className="phone-input">
            <select
              className="input phone-code"
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
              id="contact-phone"
              name="phoneNumber"
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="Phone number"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="contact-country">Country *</label>
          <select className="input" id="contact-country" name="country" required defaultValue="">
            <option value="" disabled>
              Select country
            </option>
            {COUNTRY_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="contact-make">Make</label>
            <select
              className="input"
              id="contact-make"
              name="make"
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                setModel("");
              }}
            >
              <option value="">Select make</option>
              {makeGroups.map((group) => (
                <optgroup key={group.country} label={group.country}>
                  {group.makes.map((item) => (
                    <option key={item.make} value={item.make}>
                      {item.make}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="contact-model">Model</label>
            <select
              className="input"
              id="contact-model"
              name="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!make}
            >
              <option value="">
                {!make ? "Select make first" : "Select model"}
              </option>
              {modelOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              {make ? <option value="Other">Other</option> : null}
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="contact-budget">Budget range</label>
            <select className="input" id="contact-budget" name="budget" defaultValue="">
              <option value="">Select budget range</option>
              {CONTACT_BUDGETS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="contact-timeline">Timeline</label>
            <select className="input" id="contact-timeline" name="timeline" defaultValue="">
              <option value="">Select timeline</option>
              {CONTACT_TIMELINES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="contact-method">Preferred contact method</label>
          <select className="input" id="contact-method" name="preferredContact" defaultValue="Email">
            {CONTACT_METHODS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="contact-message">Message (optional)</label>
          <textarea
            className="textarea"
            id="contact-message"
            name="message"
            rows={4}
            placeholder="Any specific requirements or questions..."
          />
        </div>

        {status === "error" ? (
          <p style={{ color: "var(--crimson)", margin: 0 }}>{error}</p>
        ) : null}

        <button className="btn btn-gold" type="submit" disabled={status === "sending"} style={{ width: "100%", justifyContent: "center" }}>
          {status === "sending" ? "Sending..." : "Submit Inquiry"}
        </button>
      </form>

      <div className="contact-direct">
        <a
          className="glass contact-direct-item"
          href={`mailto:${SITE.email}`}
          onClick={() => trackContact({ method: "email", location: "contact_page" })}
        >
          <span className="muted">Email</span>
          <strong>{SITE.email}</strong>
        </a>
        <a
          className="glass contact-direct-item"
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContact({ method: "whatsapp", location: "contact_page" })}
        >
          <span className="muted">WhatsApp</span>
          <strong>{SITE.phone}</strong>
        </a>
        <a
          className="glass contact-direct-item"
          href={`tel:${SITE.phone.replace(/\s/g, "")}`}
          onClick={() => trackContact({ method: "phone", location: "contact_page" })}
        >
          <span className="muted">Phone</span>
          <strong>{SITE.phone}</strong>
        </a>
      </div>
    </div>
  );
}
