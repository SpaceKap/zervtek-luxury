"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HomePortsGlobe = dynamic(
  () => import("./HomePortsGlobe").then((m) => m.HomePortsGlobe),
  { ssr: false },
);

/** Load WebGL globe only when the destinations block nears the viewport. */
export function HomePortsGlobeLazy() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [loadGlobe, setLoadGlobe] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const enable = () => {
      setLoadGlobe(true);
    };

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
      { rootMargin: "180px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (loadGlobe) {
    return <HomePortsGlobe />;
  }

  return (
    <section
      ref={sentinelRef}
      id="destinations"
      className="section container home-ports home-ports-placeholder"
      aria-label="Destinations loading"
    >
      <div className="home-ports-skeleton" aria-hidden />
    </section>
  );
}
