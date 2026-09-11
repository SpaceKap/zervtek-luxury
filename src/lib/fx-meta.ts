import { FALLBACK_JPY_PER_UNIT, type JpyPerUnitRates } from "@/lib/currency";

/** Rates older than this are flagged stale in the UI. */
export const FX_STALE_AFTER_MS = 48 * 60 * 60 * 1000;

export type FxSnapshot = {
  rates: JpyPerUnitRates;
  asOfDate: string | null;
  fetchedAt: string | null;
  source: "live" | "fallback";
  stale: boolean;
};

export const FALLBACK_FX_SNAPSHOT: FxSnapshot = {
  rates: FALLBACK_JPY_PER_UNIT,
  asOfDate: null,
  fetchedAt: null,
  source: "fallback",
  stale: true,
};

export function fxIsStale(fetchedAt: Date | string | number | null | undefined, now = Date.now()): boolean {
  if (fetchedAt == null) return true;
  const ms =
    typeof fetchedAt === "number"
      ? fetchedAt
      : typeof fetchedAt === "string"
        ? Date.parse(fetchedAt)
        : fetchedAt.getTime();
  if (!Number.isFinite(ms)) return true;
  return now - ms > FX_STALE_AFTER_MS;
}

export function fxEstimateLabel(snapshot: FxSnapshot): string {
  if (snapshot.source === "fallback" || !snapshot.asOfDate) {
    return "Estimate · rates unavailable";
  }
  if (snapshot.stale) {
    return `Estimate · rates as of ${snapshot.asOfDate} (may be outdated)`;
  }
  return `Estimate · rates as of ${snapshot.asOfDate}`;
}
