"use client";

import { useCurrency } from "@/components/CurrencyProvider";

type Props = {
  amount: number | null | undefined;
  className?: string;
  style?: React.CSSProperties;
};

/** Short label for stock cards when dealer has no list price. */
export const INQUIRE_CARD_LABEL = "Inquire";

/** Detail / long-form label when dealer has no list price. */
export const INQUIRE_FOR_PRICE_LABEL = "Inquire for price";

export function Price({ amount, className, style }: Props) {
  const { formatPrice } = useCurrency();
  if (amount == null) {
    return (
      <span className={className} style={style}>
        {INQUIRE_CARD_LABEL}
      </span>
    );
  }
  return (
    <span className={className} style={style}>
      {formatPrice(amount)}
    </span>
  );
}

export function VehiclePrice({ price }: { price: number | null | undefined }) {
  const { formatPrice } = useCurrency();

  if (price == null) {
    return (
      <div className="detail-price-block">
        <div className="detail-price">{INQUIRE_FOR_PRICE_LABEL}</div>
        <p className="muted detail-price-note">Ask us for a quote on this vehicle</p>
      </div>
    );
  }

  return (
    <div className="detail-price-block">
      <div className="detail-price">{formatPrice(price)}</div>
      <p className="muted detail-price-note">Plus shipping</p>
    </div>
  );
}
