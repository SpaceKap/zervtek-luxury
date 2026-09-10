export type CurrencyCode = "JPY" | "USD" | "EUR";

export const CURRENCIES: { code: CurrencyCode; label: string }[] = [
  { code: "JPY", label: "¥ JPY" },
  { code: "USD", label: "$ USD" },
  { code: "EUR", label: "€ EUR" },
];

/**
 * JPY per 1 unit of foreign currency for display conversion.
 * Rates are intended to be refreshed daily via API (not shown as legal quotes in UI).
 */
export const JPY_PER_UNIT: Record<CurrencyCode, number> = {
  JPY: 1,
  USD: 150,
  EUR: 163,
};

export function convertFromJpy(amountJpy: number, currency: CurrencyCode): number {
  if (currency === "JPY") return amountJpy;
  return amountJpy / JPY_PER_UNIT[currency];
}

export function formatVehiclePrice(amountJpy: number, currency: CurrencyCode): string {
  const value = convertFromJpy(amountJpy, currency);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
