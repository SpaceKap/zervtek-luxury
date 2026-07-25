"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "./LuxuryPreloader.module.css";
import type { PreloaderSettings } from "./preloader-settings";

type PreloaderPhase = "loading" | "leaving" | "hidden";

interface LuxuryPreloaderProps {
  settings: PreloaderSettings;
  onComplete?: () => void;
  onPhaseChange?: (phase: PreloaderPhase) => void;
}

function ms(n: number) {
  return `${n}ms`;
}

function px(n: number) {
  return `${n}px`;
}

export default function LuxuryPreloader({
  settings,
  onComplete,
  onPhaseChange,
}: LuxuryPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<PreloaderPhase>("loading");

  const exitTimeout = useRef<number | null>(null);
  const holdTimeout = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const cssVars = useMemo(
    () =>
      ({
        "--lp-bg": settings.bg,
        "--lp-text": settings.text,
        "--lp-muted": settings.muted,
        "--lp-muted-soft": settings.mutedSoft,
        "--lp-track": settings.track,
        "--lp-fill": settings.fill,
        "--lp-frame": settings.frame,
        "--lp-ambient": settings.ambient,
        "--lp-leave-duration": ms(settings.leaveDuration),
        "--lp-welcome-opacity-duration": ms(settings.welcomeOpacityDuration),
        "--lp-welcome-tracking-duration": ms(settings.welcomeTrackingDuration),
        "--lp-welcome-tracking": `${settings.welcomeTracking}em`,
        "--lp-bar-height": px(settings.barHeight),
        "--lp-face-height": px(settings.faceHeight),
        "--lp-corner-opacity-duration": ms(settings.cornerOpacityDuration),
        "--lp-corner-opacity-delay": ms(settings.cornerOpacityDelay),
      }) as CSSProperties,
    [settings],
  );

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const duration = reducedMotion ? 500 : settings.loadingDuration;
    const startTime = performance.now();

    let animationFrame = 0;

    const beginExit = () => {
      setPhase("leaving");

      exitTimeout.current = window.setTimeout(() => {
        setPhase("hidden");
        onCompleteRef.current?.();
      }, settings.leaveDuration + 100);
    };

    const animateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - rawProgress, settings.easePower);

      setProgress(Math.round(easedProgress * 100));

      if (rawProgress < 1) {
        animationFrame = requestAnimationFrame(animateProgress);
        return;
      }

      holdTimeout.current = window.setTimeout(
        beginExit,
        reducedMotion ? 50 : settings.readyDelay,
      );
    };

    animationFrame = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animationFrame);
      if (holdTimeout.current) window.clearTimeout(holdTimeout.current);
      if (exitTimeout.current) window.clearTimeout(exitTimeout.current);
    };
  }, [
    settings.loadingDuration,
    settings.readyDelay,
    settings.easePower,
    settings.leaveDuration,
  ]);

  useEffect(() => {
    if (phase === "hidden") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div
      className={[
        styles.preloader,
        phase === "leaving" ? styles.leaving : "",
      ].join(" ")}
      style={cssVars}
      data-show-frame={settings.showFrame ? "true" : "false"}
      data-show-grain={settings.showGrain ? "true" : "false"}
      aria-label="ZervTek introduction"
      aria-busy={phase === "loading"}
    >
      {settings.showAmbient ? <div className={styles.ambientLight} /> : null}

      <div className={styles.loaderGroup}>
        <p className={styles.welcome}>{settings.welcome}</p>

        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          style={{ height: `var(--lp-bar-height)`, alignSelf: "stretch" }}
        >
          <span
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        {settings.showProgressValue ? (
          <span className={styles.progressValueInline}>
            {progress.toString().padStart(2, "0")}
          </span>
        ) : null}
      </div>

      {settings.showCornerText ? (
        <div className={styles.cornerText} data-visible="true">
          <span>{settings.cornerLeft}</span>
          <span>{settings.cornerRight}</span>
        </div>
      ) : null}
    </div>
  );
}

export type { PreloaderPhase };
