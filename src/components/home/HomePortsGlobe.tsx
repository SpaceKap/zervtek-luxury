"use client";

import { useState } from "react";
import { GlobeLive } from "@/components/ui/cobe-globe-live";
import {
  DESTINATION_PORT_REGIONS,
  GLOBE_PORT_MARKERS,
} from "@/lib/destination-ports";

export function HomePortsGlobe() {
  const [activeRegion, setActiveRegion] = useState(
    DESTINATION_PORT_REGIONS[0]?.region ?? "",
  );
  const region =
    DESTINATION_PORT_REGIONS.find((r) => r.region === activeRegion) ??
    DESTINATION_PORT_REGIONS[0];

  return (
    <section
      className="section container home-ports"
      aria-labelledby="home-ports-title"
    >
      <div className="section-head">
        <div>
          <span className="eyebrow">Destinations</span>
          <h2 id="home-ports-title">Ports we ship to</h2>
          <p
            className="muted"
            style={{ marginTop: 10, maxWidth: 520, lineHeight: 1.65 }}
          >
            From Japan&apos;s major departure ports to destinations across every
            ocean — RoRo and container routes managed end to end. Drag the globe
            to explore.
          </p>
        </div>
      </div>

      <div className="home-ports-grid">
        <div className="home-ports-globe">
          <GlobeLive
            markers={GLOBE_PORT_MARKERS}
            className="home-ports-globe-canvas"
          />
          <p className="home-ports-globe-hint muted">
            Gold markers are active shipping hubs — rotate to reveal labels.
          </p>
        </div>

        <div className="home-ports-panel">
          <div
            className="home-ports-tabs"
            role="tablist"
            aria-label="Port regions"
          >
            {DESTINATION_PORT_REGIONS.map((r) => {
              const selected = r.region === region?.region;
              return (
                <button
                  key={r.region}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={
                    selected
                      ? "home-ports-tab home-ports-tab--active"
                      : "home-ports-tab"
                  }
                  onClick={() => setActiveRegion(r.region)}
                >
                  {r.region.replace(" — Departure", "")}
                </button>
              );
            })}
          </div>

          {region ? (
            <div
              className="home-ports-panel-body"
              role="tabpanel"
              aria-label={region.region}
            >
              <h3 className="home-ports-panel-title">{region.region}</h3>
              <div className="home-ports-countries">
                {region.countries.map((country) => (
                  <div
                    key={`${region.region}-${country.name}`}
                    className="home-ports-country"
                  >
                    <p className="home-ports-country-name">{country.name}</p>
                    <ul>
                      {country.ports.map((port) => (
                        <li key={port}>{port}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
