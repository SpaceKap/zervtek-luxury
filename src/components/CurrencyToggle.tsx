"use client";

import { CURRENCIES } from "@/lib/currency";
import { useCurrency } from "@/components/CurrencyProvider";

export function CurrencyToggle({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={`currency-toggle ${className}`.trim()} role="group" aria-label="Display currency">
      {CURRENCIES.map((item) => (
        <button
          key={item.code}
          type="button"
          className={currency === item.code ? "active" : undefined}
          aria-pressed={currency === item.code}
          onClick={() => setCurrency(item.code)}
        >
          {item.code}
        </button>
      ))}
    </div>
  );
}
