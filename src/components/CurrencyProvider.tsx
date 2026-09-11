"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  type CurrencyCode,
  formatVehiclePrice,
} from "@/lib/currency";
import { type FxSnapshot, FALLBACK_FX_SNAPSHOT } from "@/lib/fx-meta";

const STORAGE_KEY = "luxury-currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountJpy: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  children,
  fx: initialFx,
}: {
  children: React.ReactNode;
  fx?: FxSnapshot;
}) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("JPY");
  const fx = initialFx ?? FALLBACK_FX_SNAPSHOT;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (saved === "JPY" || saved === "USD" || saved === "EUR") {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const formatPrice = useCallback(
    (amountJpy: number) => formatVehiclePrice(amountJpy, currency, fx.rates),
    [currency, fx.rates],
  );

  const value = useMemo(
    () => ({ currency, setCurrency, formatPrice }),
    [currency, setCurrency, formatPrice],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
