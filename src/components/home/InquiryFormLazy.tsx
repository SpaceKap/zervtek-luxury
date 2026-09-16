"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const InquiryForm = dynamic(
  () => import("@/components/InquiryForm").then((m) => m.InquiryForm),
  { ssr: false },
);

type Props = {
  compact?: boolean;
  formLocation?: string;
};

/** Defer heavy inquiry form (large country list) until user scrolls near it. */
export function InquiryFormLazy({ compact, formLocation }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const enable = () => setShow(true);

    if (typeof IntersectionObserver === "undefined") {
      enable();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          enable();
          io.disconnect();
        }
      },
      { rootMargin: "160px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="inquiry-form-lazy">
      {show ? (
        <InquiryForm compact={compact} formLocation={formLocation} />
      ) : (
        <div className="inquiry-form-skeleton" aria-hidden />
      )}
    </div>
  );
}
