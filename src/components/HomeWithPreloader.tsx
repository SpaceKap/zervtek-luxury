"use client";

import { useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import LuxuryPreloader, { type PreloaderPhase } from "@/components/mock/LuxuryPreloader";
import {
  DEFAULT_PRELOADER_SETTINGS,
  type PreloaderSettings,
} from "@/components/mock/preloader-settings";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mock-serif",
  display: "swap",
});

const SITE_PRELOADER: PreloaderSettings = {
  ...DEFAULT_PRELOADER_SETTINGS,
  welcome: "Welcome to ZervTek",
  loaderShiftY: 0,
  showCornerText: true,
  readyDelay: 200,
};

type Props = {
  children: React.ReactNode;
};

export function HomeWithPreloader({ children }: Props) {
  const [phase, setPhase] = useState<PreloaderPhase>("loading");
  const revealed = phase === "leaving" || phase === "hidden";
  const showPreloader = phase !== "hidden";

  return (
    <div
      className={[
        serif.variable,
        "home-intro",
        revealed ? "home-intro--revealed" : "home-intro--pending",
      ].join(" ")}
    >
      {showPreloader ? (
        <LuxuryPreloader
          settings={SITE_PRELOADER}
          onPhaseChange={setPhase}
          onComplete={() => setPhase("hidden")}
        />
      ) : null}
      {children}
    </div>
  );
}
