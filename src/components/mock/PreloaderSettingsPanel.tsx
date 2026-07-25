"use client";

import styles from "./PreloaderSettings.module.css";
import {
  DEFAULT_PRELOADER_SETTINGS,
  settingsToCssSnippet,
  type PreloaderSettings,
} from "./preloader-settings";
import type { PreloaderPhase } from "./LuxuryPreloader";

type Props = {
  settings: PreloaderSettings;
  phase: PreloaderPhase | "idle";
  collapsed: boolean;
  onCollapsedChange: (v: boolean) => void;
  onChange: (next: PreloaderSettings) => void;
  onReplay: () => void;
  onReset: () => void;
};

type NumField = {
  key: keyof PreloaderSettings;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
};

const TIMING_JS: NumField[] = [
  { key: "loadingDuration", label: "Loading duration", min: 400, max: 8000, step: 50, unit: "ms" },
  { key: "readyDelay", label: "Hold after fill", min: 0, max: 1500, step: 10, unit: "ms" },
  { key: "leaveDuration", label: "Exit fade", min: 100, max: 2000, step: 25, unit: "ms" },
  { key: "easePower", label: "Progress ease power", min: 1, max: 6, step: 0.1 },
];

const TIMING_FLIP: NumField[] = [
  { key: "flipDuration", label: "Flip duration", min: 200, max: 2500, step: 25, unit: "ms" },
  { key: "loaderShiftDuration", label: "Loader shift duration", min: 200, max: 2500, step: 25, unit: "ms" },
  { key: "loaderShiftY", label: "Loader shift Y", min: 0, max: 220, step: 1, unit: "px" },
  { key: "perspective", label: "Perspective", min: 200, max: 2400, step: 20, unit: "px" },
  { key: "faceHeight", label: "Face height", min: 32, max: 80, step: 1, unit: "px" },
  { key: "barHeight", label: "Bar height", min: 1, max: 6, step: 0.5, unit: "px" },
];

const TIMING_MISC: NumField[] = [
  { key: "welcomeOpacityDuration", label: "Welcome opacity", min: 100, max: 2000, step: 25, unit: "ms" },
  { key: "welcomeTrackingDuration", label: "Welcome tracking", min: 100, max: 2000, step: 25, unit: "ms" },
  { key: "welcomeTracking", label: "Welcome tracking start", min: 0.1, max: 0.8, step: 0.01, unit: "em" },
  { key: "welcomeTrackingRevealed", label: "Welcome tracking end", min: 0.1, max: 0.9, step: 0.01, unit: "em" },
  { key: "cornerOpacityDelay", label: "Corner delay", min: 0, max: 3000, step: 25, unit: "ms" },
  { key: "cornerOpacityDuration", label: "Corner duration", min: 100, max: 2000, step: 25, unit: "ms" },
  { key: "buttonHoverDuration", label: "Button hover", min: 100, max: 800, step: 10, unit: "ms" },
  { key: "arrowShift", label: "Arrow shift", min: 0, max: 16, step: 1, unit: "px" },
];

const COLOR_FIELDS: { key: keyof PreloaderSettings; label: string }[] = [
  { key: "bg", label: "Background" },
  { key: "text", label: "Text" },
  { key: "fill", label: "Progress fill" },
  { key: "buttonBg", label: "Button background" },
  { key: "buttonText", label: "Button text" },
  { key: "buttonBorder", label: "Button border" },
];

function asNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function hexFromCssColor(value: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const r = value[1];
    const g = value[2];
    const b = value[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#000000";
}

export function PreloaderSettingsPanel({
  settings,
  phase,
  collapsed,
  onCollapsedChange,
  onChange,
  onReplay,
  onReset,
}: Props) {
  const set = <K extends keyof PreloaderSettings>(key: K, value: PreloaderSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const renderRange = (field: NumField) => {
    const raw = settings[field.key];
    const value = typeof raw === "number" ? raw : 0;

    return (
      <div className={styles.field} key={String(field.key)}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor={String(field.key)}>
            {field.label}
          </label>
          <span className={styles.value}>
            {value}
            {field.unit ?? ""}
          </span>
        </div>
        <input
          id={String(field.key)}
          className={styles.range}
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={(e) => set(field.key, asNumber(e.target.value) as PreloaderSettings[typeof field.key])}
        />
      </div>
    );
  };

  return (
    <aside className={styles.panel} data-collapsed={collapsed ? "true" : "false"}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Preloader lab</h2>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => onCollapsedChange(!collapsed)}
          aria-label={collapsed ? "Expand settings" : "Collapse settings"}
        >
          {collapsed ? "‹" : "›"}
        </button>
      </div>

      <div className={styles.collapsedHint}>Settings</div>

      <div className={styles.actions}>
        <button type="button" className={styles.actionBtn} onClick={onReplay}>
          Replay
        </button>
        <button
          type="button"
          className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
          onClick={onReset}
        >
          Reset
        </button>
      </div>

      <div className={styles.phase}>
        Phase <strong>{phase}</strong>
      </div>

      <div className={styles.body}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Copy</h3>
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Welcome</span>
            </div>
            <input
              className={styles.input}
              value={settings.welcome}
              onChange={(e) => set("welcome", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Corner left</span>
            </div>
            <input
              className={styles.input}
              value={settings.cornerLeft}
              onChange={(e) => set("cornerLeft", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Corner right</span>
            </div>
            <input
              className={styles.input}
              value={settings.cornerRight}
              onChange={(e) => set("cornerRight", e.target.value)}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Visibility</h3>
          {(
            [
              ["showFrame", "Frame border"],
              ["showGrain", "Subtle grain"],
              ["showAmbient", "Ambient soft light"],
              ["showProgressValue", "Progress digits"],
              ["showCornerText", "Corner labels"],
            ] as const
          ).map(([key, label]) => (
            <label className={styles.check} key={key}>
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => set(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Colors</h3>
          {COLOR_FIELDS.map((field) => {
            const value = String(settings[field.key]);
            return (
              <div className={styles.field} key={field.key}>
                <div className={styles.labelRow}>
                  <span className={styles.label}>{field.label}</span>
                </div>
                <div className={styles.colorRow}>
                  <input
                    className={styles.color}
                    type="color"
                    value={hexFromCssColor(value)}
                    onChange={(e) => set(field.key, e.target.value)}
                  />
                  <input
                    className={styles.input}
                    value={value}
                    onChange={(e) => set(field.key, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Muted text (rgba ok)</span>
            </div>
            <input
              className={styles.input}
              value={settings.muted}
              onChange={(e) => set("muted", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Soft muted</span>
            </div>
            <input
              className={styles.input}
              value={settings.mutedSoft}
              onChange={(e) => set("mutedSoft", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Track</span>
            </div>
            <input
              className={styles.input}
              value={settings.track}
              onChange={(e) => set("track", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Frame</span>
            </div>
            <input
              className={styles.input}
              value={settings.frame}
              onChange={(e) => set("frame", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Ambient</span>
            </div>
            <input
              className={styles.input}
              value={settings.ambient}
              onChange={(e) => set("ambient", e.target.value)}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>JS timing</h3>
          {TIMING_JS.map(renderRange)}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Flip / loader</h3>
          {TIMING_FLIP.map(renderRange)}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Welcome / corners / button</h3>
          {TIMING_MISC.map(renderRange)}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Export snapshot</h3>
          <pre className={styles.export}>{settingsToCssSnippet(settings)}</pre>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
            style={{ width: "100%", marginTop: 8 }}
            onClick={async () => {
              await navigator.clipboard.writeText(
                JSON.stringify(settings, null, 2),
              );
            }}
          >
            Copy JSON
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => onChange({ ...DEFAULT_PRELOADER_SETTINGS })}
          >
            Load defaults
          </button>
        </section>
      </div>
    </aside>
  );
}
