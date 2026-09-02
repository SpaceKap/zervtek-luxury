"use client";

import dynamic from "next/dynamic";

export const HomePortsGlobeLazy = dynamic(
  () => import("./HomePortsGlobe").then((m) => m.HomePortsGlobe),
  {
    ssr: false,
    loading: () => <div className="home-ports-skeleton" aria-hidden />,
  },
);
