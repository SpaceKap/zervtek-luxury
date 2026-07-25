const TRANSIT_TIMES = [
  { region: "Asia & Southeast Asia", days: "7-14 days" },
  { region: "Oceania (AU/NZ)", days: "14-21 days" },
  { region: "Middle East", days: "21-28 days" },
  { region: "Africa", days: "28-42 days" },
  { region: "Europe", days: "35-45 days" },
  { region: "Caribbean / South America", days: "35-50 days" },
] as const;

const SHIPPING_METHODS = [
  { label: "RoRo (Roll-on/Roll-off)", value: "Most economical" },
  { label: "Container (20ft/40ft)", value: "Maximum protection" },
  { label: "Insurance", value: "Available on request" },
  { label: "Documentation", value: "Full export support" },
  { label: "Tracking", value: "Real-time updates" },
] as const;

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 17l2.5-7h13L21 17M4 17h16M2 20c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0 3.5 1 5 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 4v6M9 7h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ShippingInfo() {
  return (
    <section className="section container shipping-info-section">
      <div className="section-head section-head-center">
        <div>
          <h2 className="heading shipping-block-title">Shipping Information</h2>
          <p className="muted section-lead">Important details about our shipping process</p>
        </div>
      </div>

      <div className="shipping-info-grid">
        <article className="glass shipping-info-card">
          <header className="shipping-info-card-head">
            <span className="shipping-info-icon">
              <CalendarIcon />
            </span>
            <h3>Transit Times</h3>
          </header>
          <dl className="shipping-info-list">
            {TRANSIT_TIMES.map((row) => (
              <div className="shipping-info-row" key={row.region}>
                <dt>{row.region}</dt>
                <dd>{row.days}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="glass shipping-info-card">
          <header className="shipping-info-card-head">
            <span className="shipping-info-icon">
              <ShipIcon />
            </span>
            <h3>Shipping Methods</h3>
          </header>
          <dl className="shipping-info-list">
            {SHIPPING_METHODS.map((row) => (
              <div className="shipping-info-row" key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>

      <aside className="shipping-notice">
        <h3>Schedule Notice</h3>
        <p>
          Shipping schedules are subject to change due to weather, port conditions, and carrier
          operations. Contact us for the latest schedule and to confirm availability for your
          shipment.
        </p>
      </aside>
    </section>
  );
}
