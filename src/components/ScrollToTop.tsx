"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Force window to the top on route changes.
 * Smooth scroll + image layout/scroll-anchoring on detail pages often leave
 * the viewport slightly offset after clicking a listing.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip in-page hash targets (about#contact-form, etc.)
    if (window.location.hash) return;

    const reset = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    reset();
    // After paint / late image layout (carousel thumbs).
    const t0 = window.requestAnimationFrame(reset);
    const t1 = window.setTimeout(reset, 0);
    const t2 = window.setTimeout(reset, 100);

    return () => {
      window.cancelAnimationFrame(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
