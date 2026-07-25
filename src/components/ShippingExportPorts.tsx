const PORTS = [
  {
    name: "Yokohama",
    prefecture: "Kanagawa Prefecture",
    description:
      "Japan's largest vehicle export port, handling over 2 million vehicles annually.",
  },
  {
    name: "Nagoya",
    prefecture: "Aichi Prefecture",
    description: "Major hub for Toyota exports and industrial machinery shipments.",
  },
  {
    name: "Kobe",
    prefecture: "Hyogo Prefecture",
    description: "Historic port serving western Japan with excellent logistics infrastructure.",
  },
  {
    name: "Osaka",
    prefecture: "Osaka Prefecture",
    description: "Key commercial port with extensive RoRo facilities for vehicle exports.",
  },
  {
    name: "Kawasaki",
    prefecture: "Kanagawa Prefecture",
    description: "Industrial port specializing in heavy machinery and vehicle shipments.",
  },
  {
    name: "Hakata",
    prefecture: "Fukuoka Prefecture",
    description: "Gateway port for exports to Southeast Asia and Oceania.",
  },
] as const;

function AnchorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v14M12 17a5 5 0 0 1-5-5M12 17a5 5 0 0 0 5-5M7 12H4a8 8 0 0 0 16 0h-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function ShippingExportPorts() {
  return (
    <section className="section container shipping-ports-section">
      <div className="section-head section-head-center">
        <div>
          <h2 className="heading shipping-block-title">Japanese Export Ports</h2>
          <p className="muted section-lead">
            Our vehicles and machinery ship from Japan&apos;s major export ports
          </p>
        </div>
      </div>

      <div className="shipping-ports-grid">
        {PORTS.map((port) => (
          <article className="glass shipping-port-card" key={port.name}>
            <div className="shipping-port-card-head">
              <span className="shipping-port-icon">
                <AnchorIcon />
              </span>
              <div>
                <h3 className="shipping-port-name">{port.name}</h3>
                <p className="shipping-port-prefecture">{port.prefecture}</p>
              </div>
            </div>
            <p className="shipping-port-desc">{port.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
