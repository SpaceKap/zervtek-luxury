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
    // Skip heavy decorative iframe on narrow phones.
    if (window.matchMedia("(max-width: 720px)").matches) return;

    let cancelled = false;
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    const w = window as IdleWindow;
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(enable, { timeout: 2500 });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }

    const t = window.setTimeout(enable, 1200);
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
