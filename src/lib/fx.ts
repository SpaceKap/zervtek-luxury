import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  type JpyPerUnitRates,
} from "@/lib/currency";
import {
  FALLBACK_FX_SNAPSHOT,
  type FxSnapshot,
  fxIsStale,
} from "@/lib/fx-meta";

export {
  FALLBACK_FX_SNAPSHOT,
  FX_STALE_AFTER_MS,
  fxEstimateLabel,
  fxIsStale,
  type FxSnapshot,
} from "@/lib/fx-meta";

const FRANKFURTER_URL =
  "https://api.frankfurter.app/latest?from=JPY&to=USD,EUR";

type FrankfurterResponse = {
  amount: number;
  base: string;
  date: string;
  rates: { USD?: number; EUR?: number };
};

/** Invert Frankfurter "foreign per 1 JPY" into "JPY per 1 foreign". */
export function jpyPerUnitFromForeignPerJpy(foreignPerJpy: number): number {
  if (!Number.isFinite(foreignPerJpy) || foreignPerJpy <= 0) {
    throw new Error("Invalid FX rate");
  }
  return 1 / foreignPerJpy;
}

export async function fetchFrankfurterRates(): Promise<{
  rates: Pick<JpyPerUnitRates, "USD" | "EUR">;
  asOfDate: string;
}> {
  const res = await fetch(FRANKFURTER_URL, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Frankfurter HTTP ${res.status}`);
  }
  const data = (await res.json()) as FrankfurterResponse;
  const usd = data.rates?.USD;
  const eur = data.rates?.EUR;
  if (typeof usd !== "number" || typeof eur !== "number") {
    throw new Error("Frankfurter missing USD/EUR");
  }
  return {
    asOfDate: data.date,
    rates: {
      USD: jpyPerUnitFromForeignPerJpy(usd),
      EUR: jpyPerUnitFromForeignPerJpy(eur),
    },
  };
}

export async function refreshFxRatesFromFrankfurter(): Promise<{
  USD: number;
  EUR: number;
  asOfDate: string;
  fetchedAt: string;
}> {
  const { rates, asOfDate } = await fetchFrankfurterRates();
  const fetchedAt = new Date();

  await prisma.$transaction([
    prisma.fxRate.upsert({
      where: { id: "USD" },
      create: {
        id: "USD",
        jpyPerUnit: rates.USD,
        source: "frankfurter",
        asOfDate,
        fetchedAt,
      },
      update: {
        jpyPerUnit: rates.USD,
        source: "frankfurter",
        asOfDate,
        fetchedAt,
      },
    }),
    prisma.fxRate.upsert({
      where: { id: "EUR" },
      create: {
        id: "EUR",
        jpyPerUnit: rates.EUR,
        source: "frankfurter",
        asOfDate,
        fetchedAt,
      },
      update: {
        jpyPerUnit: rates.EUR,
        source: "frankfurter",
        asOfDate,
        fetchedAt,
      },
    }),
  ]);

  return {
    USD: rates.USD,
    EUR: rates.EUR,
    asOfDate,
    fetchedAt: fetchedAt.toISOString(),
  };
}

async function loadFxSnapshotFromDb(): Promise<FxSnapshot> {
  const rows = await prisma.fxRate.findMany({
    where: { id: { in: ["USD", "EUR"] } },
  });

  const byId = new Map(rows.map((row) => [row.id, row]));
  const usd = byId.get("USD");
  const eur = byId.get("EUR");
  const usdOk = usd && Number.isFinite(usd.jpyPerUnit) && usd.jpyPerUnit > 0;
  const eurOk = eur && Number.isFinite(eur.jpyPerUnit) && eur.jpyPerUnit > 0;

  if (!usdOk || !eurOk) {
    return FALLBACK_FX_SNAPSHOT;
  }

  const fetchedAtMs = Math.min(usd.fetchedAt.getTime(), eur.fetchedAt.getTime());
  const asOfDate = usd.asOfDate || eur.asOfDate || null;

  return {
    rates: {
      JPY: 1,
      USD: usd.jpyPerUnit,
      EUR: eur.jpyPerUnit,
    },
    asOfDate,
    fetchedAt: new Date(fetchedAtMs).toISOString(),
    source: "live",
    stale: fxIsStale(fetchedAtMs),
  };
}

/** Cached for 1h so layout does not hit DB every request; cron updates daily. */
export const getFxSnapshot = unstable_cache(
  async () => loadFxSnapshotFromDb(),
  ["fx-rates"],
  { revalidate: 3600, tags: ["fx-rates"] },
);

/** @deprecated Prefer getFxSnapshot */
export async function getFxRates(): Promise<JpyPerUnitRates> {
  const snap = await getFxSnapshot();
  return snap.rates;
}
