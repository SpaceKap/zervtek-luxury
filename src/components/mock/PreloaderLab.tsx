"use client";

import { useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import LuxuryPreloader, { type PreloaderPhase } from "./LuxuryPreloader";
import { PreloaderSettingsPanel } from "./PreloaderSettingsPanel";
import {
  DEFAULT_PRELOADER_SETTINGS,
  type PreloaderSettings,
} from "./preloader-settings";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mock-serif",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
};

export function PreloaderLab({ children }: Props) {
  const [settings, setSettings] = useState<PreloaderSettings>(
    DEFAULT_PRELOADER_SETTINGS,
  );
  const [runId, setRunId] = useState(0);
  const [phase, setPhase] = useState<PreloaderPhase | "idle">("loading");
  const [collapsed, setCollapsed] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  const replay = () => {
    setShowPreloader(true);
    setPhase("loading");
    setRunId((n) => n + 1);
  };

  const revealed = phase === "leaving" || phase === "hidden" || !showPreloader;

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
          key={runId}
          settings={settings}
          onPhaseChange={(p) => {
            setPhase(p);
          }}
          onComplete={() => {
            setShowPreloader(false);
            setPhase("hidden");
          }}
        />
      ) : null}

      <PreloaderSettingsPanel
        settings={settings}
        phase={phase}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        onChange={setSettings}
        onReplay={replay}
        onReset={() => {
          setSettings({ ...DEFAULT_PRELOADER_SETTINGS, loaderShiftY: 0 });
          replay();
        }}
      />

      <div
        style={{
          paddingRight: collapsed ? 44 : 360,
        }}
      >
        {children}
      </div>
    </div>
  );
}
