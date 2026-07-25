const PARTNERS = [
  "G ALLIANCE SHIPPING",
  "GRIMALDI",
  "HOEGH",
  "MOL",
  "NYK",
  "SEVEN SEALS CO.,LTD",
  "THE KEIHIN CO., LTD.",
  "Yuwa Shipping Co., Ltd",
] as const;

function PartnerTrack({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="shipping-marquee-track" aria-hidden={ariaHidden || undefined}>
      {PARTNERS.map((name) => (
        <span className="shipping-marquee-item" key={name}>
          {name}
        </span>
      ))}
    </div>
  );
}

export function ShippingPartnersMarquee() {
  return (
    <div className="shipping-marquee" aria-label="Shipping partners">
      <div className="shipping-marquee-inner">
        <PartnerTrack />
        <PartnerTrack ariaHidden />
      </div>
    </div>
  );
}
