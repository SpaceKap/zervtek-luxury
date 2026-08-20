import Image from "next/image";
import Link from "next/link";
import { getFeaturedVehicles } from "@/lib/vehicles";
import { VehicleCard } from "@/components/VehicleCard";
import { InquiryForm } from "@/components/InquiryForm";
import { PreloaderLab } from "@/components/mock/PreloaderLab";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=80";

const STEPS = [
  { n: "01", t: "Talk to a specialist", d: "Share the car you want, your budget and destination. We advise on the best options available." },
  { n: "02", t: "Curated selection", d: "We hand-pick vehicles from our stock and Japan's finest sources, with full condition reports." },
  { n: "03", t: "Inspect & reserve", d: "Review detailed photography and inspection notes, then reserve your car with confidence." },
  { n: "04", t: "We handle everything", d: "Servicing, documentation, customs and shipping to your destination port — all managed for you." },
  { n: "05", t: "Take delivery", d: "Your vehicle arrives, ready to enjoy. Ongoing support is only a message away." },
];

export default async function MockPreloaderPage() {
  const featured = await getFeaturedVehicles(6);

  return (
    <PreloaderLab>
      <main>
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              background: "rgba(255,255,255,0.92)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              padding: "10px 20px",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.45)",
            }}
          >
            Mock · Preloader lab · Live home untouched
          </div>

          {/* Hero — editorial layout (duplicate of home) */}
          <section className="hero-editorial">
            <div className="container hero-editorial-inner">
              <div className="hero-meta">
                <span className="hero-meta-right">
                  <span>Chiba, Japan</span>
                  <span>The Pride for Quality</span>
                </span>
              </div>

              <div className="hero-stage">
                <figure className="hero-photo">
                  <Image
                    src={HERO_IMAGE}
                    alt="Luxury performance car"
                    fill
                    priority
                    sizes="(max-width: 860px) 100vw, 520px"
                    style={{ objectFit: "cover" }}
                  />
                </figure>

                <h1 className="hero-title">
                  <span>Luxury &amp;</span>
                  <span>performance,</span>
                  <span>sourced from Japan.</span>
                </h1>

                <a href="#featured" className="hero-arrow" aria-label="Scroll to featured vehicles">
                  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
                    <path d="M12 12 L60 60 M60 60 H28 M60 60 V28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          <section className="section container" id="featured">
            <header className="stock-hero" style={{ paddingBlock: "0 44px" }}>
              <div className="stock-meta">
                <span>{new URL(SITE.url).hostname}</span>
                <span>The Pride for Quality</span>
              </div>
              <h2 className="stock-title">The collection</h2>
              <p className="stock-lead">
                Hand-selected performance and luxury vehicles from Japan — inspected, documented and ready
                to ship worldwide.
              </p>
            </header>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}>
              <Link className="btn btn-outline" href="/stock">
                View all stock
              </Link>
            </div>

            {featured.length > 0 ? (
              <div className="vehicle-grid stock-grid">
                {featured.map((v) => (
                  <VehicleCard key={v.id} v={v} />
                ))}
              </div>
            ) : (
              <div className="empty-state glass" style={{ borderRadius: 14 }}>
                Our latest arrivals are being prepared. Please check back shortly or contact us for current availability.
              </div>
            )}
          </section>

          <section className="section container">
            <div className="section-head">
              <div>
                <span className="eyebrow">How it works</span>
                <h2>A concierge approach to importing</h2>
              </div>
            </div>
            <div className="steps">
              {STEPS.map((s) => (
                <div className="step glass" key={s.n}>
                  <div className="step-num">{s.n}</div>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section container" id="inquire">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="inquire-grid">
              <div>
                <span className="eyebrow">Enquire</span>
                <h2 className="heading" style={{ fontSize: "clamp(24px,3vw,34px)", margin: "10px 0 18px" }}>
                  Find your next vehicle
                </h2>
                <p className="muted" style={{ lineHeight: 1.7, maxWidth: 460 }}>
                  Tell us what you&apos;re looking for and our team will source the perfect car for you.
                  Every enquiry is handled personally — no call centres, no pressure.
                </p>
              </div>
              <div className="glass" style={{ padding: 28, borderRadius: 16 }}>
                <InquiryForm compact />
              </div>
            </div>
            <style>{`@media (max-width: 820px){ .inquire-grid{ grid-template-columns: 1fr !important; } }`}</style>
          </section>
      </main>
    </PreloaderLab>
  );
}
