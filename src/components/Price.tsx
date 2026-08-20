"use client";

import { useCurrency } from "@/components/CurrencyProvider";

type Props = {
  amount: number;
  className?: string;
  style?: React.CSSProperties;
};

export function Price({ amount, className, style }: Props) {
  const { formatPrice } = useCurrency();
  return (
    <span className={className} style={style}>
      {formatPrice(amount)}
    </span>
  );
}

export function VehiclePrice({ price }: { price: number }) {
  const { currency, formatPrice } = useCurrency();
  const isConverted = currency !== "JPY";

  return (
    <div className="detail-price-block">
      <div className="detail-price">{formatPrice(price)}</div>
      <p className="muted detail-price-note">
        Plus shipping
        {isConverted ? " · approx. exchange rate" : null}
      </p>
    </div>
  );
}
