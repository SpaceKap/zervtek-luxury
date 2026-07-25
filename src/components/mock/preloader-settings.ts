export type PreloaderSettings = {
  // Copy
  welcome: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  cornerLeft: string;
  cornerRight: string;

  // Colors
  bg: string;
  text: string;
  muted: string;
  mutedSoft: string;
  track: string;
  fill: string;
  buttonBg: string;
  buttonText: string;
  buttonBorder: string;
  frame: string;
  ambient: string;

  // Visibility
  showFrame: boolean;
  showGrain: boolean;
  showAmbient: boolean;
  showProgressValue: boolean;
  showCornerText: boolean;

  // JS timing
  loadingDuration: number;
  readyDelay: number;
  leaveDuration: number;
  easePower: number;

  // Geometry
  loaderShiftY: number;
  perspective: number;
  barHeight: number;
  faceHeight: number;
  heroOffsetY: number;
  titleY: number;
  subtitleY: number;
  arrowShift: number;
  welcomeTracking: number;
  welcomeTrackingRevealed: number;

  // CSS timing
  loaderShiftDuration: number;
  welcomeOpacityDuration: number;
  welcomeTrackingDuration: number;
  flipDuration: number;
  titleOpacityDuration: number;
  titleOpacityDelay: number;
  titleMotionDuration: number;
  titleMotionDelay: number;
  subtitleOpacityDuration: number;
  subtitleOpacityDelay: number;
  subtitleMotionDuration: number;
  subtitleMotionDelay: number;
  cornerOpacityDuration: number;
  cornerOpacityDelay: number;
  buttonHoverDuration: number;
};

export const DEFAULT_PRELOADER_SETTINGS: PreloaderSettings = {
  welcome: "Welcome to ZervTek",
  title: "Where Performance Meets Precision.",
  subtitle:
    "Rare luxury and performance vehicles sourced throughout Japan and delivered worldwide.",
  buttonLabel: "Discover ZervTek",
  cornerLeft: "Japan",
  cornerRight: "Worldwide",

  bg: "#ffffff",
  text: "#0a0a0a",
  muted: "rgba(10, 10, 10, 0.42)",
  mutedSoft: "rgba(10, 10, 10, 0.22)",
  track: "rgba(10, 10, 10, 0.12)",
  fill: "#0a0a0a",
  buttonBg: "#0a0a0a",
  buttonText: "#ffffff",
  buttonBorder: "#0a0a0a",
  frame: "rgba(10, 10, 10, 0.08)",
  ambient: "rgba(10, 10, 10, 0.04)",

  showFrame: true,
  showGrain: true,
  showAmbient: true,
  showProgressValue: true,
  showCornerText: true,

  loadingDuration: 2800,
  readyDelay: 250,
  leaveDuration: 800,
  easePower: 3,

  loaderShiftY: 0,
  perspective: 1000,
  barHeight: 1,
  faceHeight: 50,
  heroOffsetY: 85,
  titleY: 45,
  subtitleY: 18,
  arrowShift: 5,
  welcomeTracking: 0.34,
  welcomeTrackingRevealed: 0.4,

  loaderShiftDuration: 1100,
  welcomeOpacityDuration: 700,
  welcomeTrackingDuration: 900,
  flipDuration: 1000,
  titleOpacityDuration: 800,
  titleOpacityDelay: 400,
  titleMotionDuration: 1100,
  titleMotionDelay: 350,
  subtitleOpacityDuration: 900,
  subtitleOpacityDelay: 900,
  subtitleMotionDuration: 1000,
  subtitleMotionDelay: 850,
  cornerOpacityDuration: 800,
  cornerOpacityDelay: 1200,
  buttonHoverDuration: 350,
};

export function settingsToCssSnippet(s: PreloaderSettings): string {
  return `loadingDuration={${s.loadingDuration}}
readyDelay={${s.readyDelay}}
leaveDuration={${s.leaveDuration}}
easePower={${s.easePower}}

/* CSS vars */
--lp-loader-shift-y: ${s.loaderShiftY}px;
--lp-loader-shift-duration: ${s.loaderShiftDuration}ms;
--lp-flip-duration: ${s.flipDuration}ms;
--lp-perspective: ${s.perspective}px;
--lp-title-motion-delay: ${s.titleMotionDelay}ms;
--lp-title-opacity-delay: ${s.titleOpacityDelay}ms;
--lp-subtitle-motion-delay: ${s.subtitleMotionDelay}ms;
--lp-subtitle-opacity-delay: ${s.subtitleOpacityDelay}ms;
--lp-corner-opacity-delay: ${s.cornerOpacityDelay}ms;`;
}
