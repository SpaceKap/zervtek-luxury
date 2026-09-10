export type CurrencyCode = "JPY" | "USD" | "EUR";

export const CURRENCIES: { code: CurrencyCode; label: string }[] = [
  { code: "JPY", label: "¥ JPY" },
  { code: "USD", label: "$ USD" },
  { code: "EUR", label: "€ EUR" },
];

export type JpyPerUnitRates = Record<CurrencyCode, number>;

/**
 * JPY per 1 unit of foreign currency for display conversion.
 * Live values come from FxRate (Frankfurter); these are boot fallbacks.
 */
export const FALLBACK_JPY_PER_UNIT: JpyPerUnitRates = {
  JPY: 1,
  USD: 150,
  EUR: 163,
};

/** @deprecated Prefer FALLBACK_JPY_PER_UNIT or rates passed into formatters. */
export const JPY_PER_UNIT = FALLBACK_JPY_PER_UNIT;

export function convertFromJpy(
  amountJpy: number,
  currency: CurrencyCode,
  rates: JpyPerUnitRates = FALLBACK_JPY_PER_UNIT,
): number {
  if (currency === "JPY") return amountJpy;
  const per = rates[currency];
  if (!Number.isFinite(per) || per <= 0) return amountJpy / FALLBACK_JPY_PER_UNIT[currency];
  return amountJpy / per;
}

export function formatVehiclePrice(
  amountJpy: number,
  currency: CurrencyCode,
  rates: JpyPerUnitRates = FALLBACK_JPY_PER_UNIT,
): string {
  const value = convertFromJpy(amountJpy, currency, rates);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
