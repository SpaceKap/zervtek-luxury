"use client";

import { useState } from "react";
import {
  getScheduleForRegion,
  SHIPPING_REGIONS,
  type ShippingRegionId,
} from "@/lib/shipping";

function ShipIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 10.189V14" />
      <path d="M12 2v3" />
      <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
      <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76" />
      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function AnchorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22V8" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
      <circle cx="12" cy="5" r="3" />
    </svg>
  );
}

export function ShippingSchedule() {
  const [region, setRegion] = useState<ShippingRegionId>("asia-africa");
  const schedule = getScheduleForRegion(region);

  return (
    <section className="section container shipping-schedule" style={{ paddingTop: 0 }}>
      <div className="shipping-region-tabs" role="tablist" aria-label="Shipping regions">
        {SHIPPING_REGIONS.map((item) => {
          const active = item.id === region;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`shipping-region-tab${active ? " is-active" : ""}`}
              onClick={() => setRegion(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {schedule ? (
        <div className="glass shipping-card" role="tabpanel">
          <div className="shipping-card-head">
            <div className="shipping-card-icon">
              <ShipIcon />
            </div>
            <div>
              <h2 className="heading" style={{ fontSize: 18, margin: 0 }}>
                {schedule.title}
              </h2>
              <p className="muted" style={{ margin: "6px 0 0", fontSize: 13 }}>
                ETD: Estimated Time of Departure / ETA: Estimated Time of Arrival
              </p>
            </div>
          </div>

          <div className="shipping-table-wrap">
            <table className="shipping-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Vessel</th>
                  <th>Voyage</th>
                  <th
                    className="shipping-group shipping-group-etd"
                    colSpan={schedule.departurePorts.length}
                  >
                    <span className="shipping-group-label">
                      <MapPinIcon /> Departure (ETD)
                    </span>
                  </th>
                  <th
                    className="shipping-group shipping-group-eta"
                    colSpan={schedule.arrivalPorts.length}
                  >
                    <span className="shipping-group-label">
                      <AnchorIcon /> Arrival (ETA)
                    </span>
                  </th>
                </tr>
                <tr className="shipping-ports">
                  <th />
                  <th />
                  <th />
                  {schedule.departurePorts.map((port) => (
                    <th key={`d-${port}`} className="shipping-port shipping-port-etd">
                      {port}
                    </th>
                  ))}
                  {schedule.arrivalPorts.map((port) => (
                    <th key={`a-${port}`} className="shipping-port shipping-port-eta">
                      {port}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.voyages.map((voyage) => (
                  <tr key={`${voyage.company}-${voyage.vessel}-${voyage.voyage}`}>
                    <td className="shipping-company">{voyage.company}</td>
                    <td className="shipping-mono">{voyage.vessel}</td>
                    <td className="shipping-mono shipping-muted">{voyage.voyage}</td>
                    {voyage.dates.map((date, i) => {
                      const isDeparture = i < schedule.departurePorts.length;
                      return (
                        <td
                          key={`${voyage.voyage}-${i}`}
                          className={`shipping-date${isDeparture ? " shipping-date-etd" : " shipping-date-eta"}`}
                        >
                          {date}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass shipping-card shipping-empty" role="tabpanel">
          <h2 className="heading" style={{ fontSize: 18, margin: "0 0 8px" }}>
            {SHIPPING_REGIONS.find((r) => r.id === region)?.label} schedule
          </h2>
          <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>
            Voyage timings for this region will be published shortly. Contact us for current
            sailings and quotes.
          </p>
        </div>
      )}
    </section>
  );
}
