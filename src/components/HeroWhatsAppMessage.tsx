"use client";

import { useEffect, useState } from "react";
import { trackContact } from "@/lib/analytics";
import { whatsappHref } from "@/lib/site";

/** True Mon–Fri 09:00–18:00 Asia/Tokyo — status shown only while desk is open. */
export function isWhatsAppDeskOnline(now = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");

  if (weekday === "Sat" || weekday === "Sun") return false;
  return hour >= 9 && hour < 18;
}

type Props = {
  className?: string;
};

export function HeroWhatsAppMessage({ className = "" }: Props) {
  const [message, setMessage] = useState("");
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const tick = () => setOnline(isWhatsAppDeskOnline());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  function handleSend() {
    const text = message.trim();
    if (!text) return;
    trackContact({ method: "whatsapp", location: "hero_message" });
    window.open(whatsappHref(text), "_blank", "noopener,noreferrer");
  }

  return (
    <div className={`hero-wa ${className}`.trim()}>
      <div className="hero-wa-head">
        <p className="hero-wa-title">Message us on WhatsApp</p>
        {online ? (
          <span className="hero-wa-status hero-wa-status--online" aria-live="polite">
            <span className="hero-wa-status-dot" aria-hidden />
            Online
          </span>
        ) : null}
      </div>

      <form
        className="hero-wa-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <textarea
          id="hero-wa-input"
          className="hero-wa-input"
          rows={2}
          aria-label="WhatsApp message"
          placeholder="Tell us the car or destination you’re looking for…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            const isMac = navigator.platform.toUpperCase().includes("MAC");
            if (e.key === "Enter" && (isMac ? e.metaKey : e.ctrlKey)) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          type="submit"
          className="hero-wa-send"
          disabled={!message.trim()}
          aria-label="Send on WhatsApp"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>

      <p className="hero-wa-hint muted">Opens WhatsApp with your message.</p>
    </div>
  );
}
