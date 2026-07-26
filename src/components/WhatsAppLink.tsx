"use client";

import { whatsappHref } from "@/lib/site";
import { trackContact } from "@/lib/analytics";

type Props = {
  /** Analytics context, e.g. "about_cta" or "shipping_cta". */
  location: string;
  className?: string;
  prefill?: string;
  children: React.ReactNode;
};

/** WhatsApp link that reports a `contact_whatsapp` event to the dataLayer. */
export function WhatsAppLink({ location, className, prefill, children }: Props) {
  return (
    <a
      className={className}
      href={whatsappHref(prefill)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackContact({ method: "whatsapp", location })}
    >
      {children}
    </a>
  );
}
