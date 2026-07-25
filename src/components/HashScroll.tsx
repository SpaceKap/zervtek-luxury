"use client";

import { useEffect } from "react";

/** Scrolls to URL hash after navigation (Next/SSGOI often skip native hash scroll). */
export function HashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const t1 = window.setTimeout(scrollToHash, 50);
    const t2 = window.setTimeout(scrollToHash, 350);
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return null;
}
