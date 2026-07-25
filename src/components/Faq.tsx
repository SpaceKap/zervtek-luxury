"use client";

import { useState } from "react";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/seo";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <JsonLd data={faqJsonLd(items)} />
      <div>
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div className="faq-item" key={i}>
              <button
                className="faq-q"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="gold-text" style={{ fontSize: 24, lineHeight: 1 }}>
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen ? <p className="faq-a">{item.a}</p> : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
