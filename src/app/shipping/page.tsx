import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ShippingExportPorts } from "@/components/ShippingExportPorts";
import { ShippingInfo } from "@/components/ShippingInfo";
import { ShippingPartnersMarquee } from "@/components/ShippingPartnersMarquee";
import { ShippingSchedule } from "@/components/ShippingSchedule";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { breadcrumbJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping Schedules from Japan",
  description:
    "View ZervTek Luxury vehicle shipping schedules from Japanese ports to destinations worldwide — Asia, Africa, Middle East, Europe, Oceania and more.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Shipping", url: `${SITE.url}/shipping` },
        ])}
      />

      <section className="container about-intro">
        <Breadcrumbs
          className="page-breadcrumbs"
          items={[{ label: "Home", href: "/" }, { label: "Shipping" }]}
        />
        <span className="eyebrow">Logistics</span>
        <h1 className="heading" style={{ fontSize: "clamp(32px,5vw,52px)", margin: "12px 0 20px", maxWidth: 820 }}>
          Shipping schedules worldwide.
        </h1>
        <p className="muted" style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 720 }}>
          Indicative sailings from Japan&apos;s major ports. Dates are estimates and subject to
          change — we confirm the best vessel for your car before booking.
        </p>
      </section>

      <ShippingSchedule />

      <ShippingExportPorts />

      <ShippingInfo />

      <ShippingPartnersMarquee />

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="glass" style={{ padding: 40, borderRadius: 16, textAlign: "center" }}>
          <h2 className="heading" style={{ fontSize: 28, marginTop: 0 }}>
            Need a shipping quote?
          </h2>
          <p className="muted" style={{ maxWidth: 520, margin: "0 auto 24px" }}>
            Tell us your destination port and we&apos;ll arrange documentation, booking and delivery.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn btn-gold" href="/about#contact-form">
              Contact us
            </Link>
            <WhatsAppLink className="btn btn-outline" location="shipping_cta">
              WhatsApp us
            </WhatsAppLink>
          </div>
        </div>
      </section>
    </main>
  );
}
