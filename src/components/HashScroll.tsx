"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Survives SSGOI scroll-reset (~10–20 frames + fade). */
const RETRY_MS = [0, 80, 200, 450, 800, 1200];

export const PENDING_HASH_KEY = "ssgoi-pending-hash";

/** Scrolls to URL hash after navigation (Next/SSGOI often skip native hash scroll). */
export function HashScroll() {
  const pathname = usePathname();
  const activeId = useRef<string | null>(null);

  useEffect(() => {
    const readId = () => {
      const fromHash = window.location.hash.replace(/^#/, "");
      if (fromHash) return fromHash;
      try {
        const stored = sessionStorage.getItem(PENDING_HASH_KEY);
        if (stored) {
          sessionStorage.removeItem(PENDING_HASH_KEY);
          return stored;
        }
      } catch {
        /* private mode */
      }
      return "";
    };

    const scrollToId = (id: string, behavior: ScrollBehavior) => {
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior, block: "start" });
      return true;
    };

    const id = readId();
    if (!id) return;

    activeId.current = id;
    if (!window.location.hash) {
      history.replaceState(null, "", `${pathname}#${id}`);
    }

    // Instant retries beat SSGOI's scrollTo(0); last pass can ease in.
    const timers = RETRY_MS.map((ms, i) =>
      window.setTimeout(() => {
        if (activeId.current !== id) return;
        scrollToId(id, i < RETRY_MS.length - 1 ? "auto" : "smooth");
      }, ms),
    );

    const onHashChange = () => {
      const next = window.location.hash.replace(/^#/, "");
      if (!next) return;
      activeId.current = next;
      scrollToId(next, "smooth");
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  return null;
}
