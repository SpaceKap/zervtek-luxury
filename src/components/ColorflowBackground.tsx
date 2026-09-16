"use client";

import { useEffect, useState } from "react";

const COLORFLOW_EMBED =
  "https://colorflow-embed.b-cdn.net/embed.html#e=Y4u_y_S-";

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/** Loads the animated mesh after first paint so it does not compete with LCP. */
export function ColorflowBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let cancelled = false;
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    const idleTimeoutMs = isMobile ? 5000 : 2500;

    const w = window as IdleWindow;
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(enable, { timeout: idleTimeoutMs });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }

    const t = window.setTimeout(enable, isMobile ? 3500 : 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div className="colorflow-bg" aria-hidden>
      {ready ? (
        <iframe src={COLORFLOW_EMBED} title="" tabIndex={-1} loading="lazy" />
      ) : null}
    </div>
  );
}
