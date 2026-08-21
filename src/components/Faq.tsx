"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PENDING_HASH_KEY } from "@/components/HashScroll";
import { faqJsonLd } from "@/lib/seo";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const router = useRouter();
  const pathname = usePathname();

  function handleAnswerClick(e: React.MouseEvent<HTMLDivElement>) {
    const anchor = (e.target as HTMLElement).closest("a");
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const href = anchor.getAttribute("href");
    if (!href?.includes("#")) return;

    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return;

    const hash = url.hash.replace(/^#/, "");
    if (!hash) return;

    e.preventDefault();

    if (url.pathname === pathname) {
      history.pushState(null, "", `#${hash}`);
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    try {
      sessionStorage.setItem(PENDING_HASH_KEY, hash);
    } catch {
      /* private mode */
    }
    router.push(url.pathname);
  }

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
              {isOpen ? (
                <div
                  className="faq-a"
                  onClick={handleAnswerClick}
                  dangerouslySetInnerHTML={{ __html: item.a }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
