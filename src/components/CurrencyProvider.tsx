"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  type CurrencyCode,
  type JpyPerUnitRates,
  FALLBACK_JPY_PER_UNIT,
  formatVehiclePrice,
} from "@/lib/currency";

const STORAGE_KEY = "luxury-currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountJpy: number) => string;
  rates: JpyPerUnitRates;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  children,
  rates: initialRates,
}: {
  children: React.ReactNode;
  rates?: JpyPerUnitRates;
}) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("JPY");
  const rates = initialRates ?? FALLBACK_JPY_PER_UNIT;

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
    (amountJpy: number) => formatVehiclePrice(amountJpy, currency, rates),
    [currency, rates],
  );

  const value = useMemo(
    () => ({ currency, setCurrency, formatPrice, rates }),
    [currency, setCurrency, formatPrice, rates],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
