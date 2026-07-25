export function formatJPY(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Japanese 万円 (man-yen) representation, e.g. 8850000 -> "885.5万円" */
export function formatManYen(value: number): string {
  const man = value / 10000;
  const str = Number.isInteger(man) ? man.toString() : man.toFixed(1);
  return `${str}万円`;
}

export function formatKm(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(value)} km`;
}

/** Strip non-digits for numeric form fields. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Format digits as 10,000,000 while typing in admin forms. */
export function formatDigitsWithCommas(value: string): string {
  const digits = digitsOnly(value);
  if (!digits) return "";
  return new Intl.NumberFormat("en-US").format(Number(digits));
}
