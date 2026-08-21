import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { CompanyProfile } from "@/components/CompanyProfile";
import { MeetUs } from "@/components/MeetUs";
import { BankDetails } from "@/components/BankDetails";
import { ContactForm } from "@/components/ContactForm";
import { HashScroll } from "@/components/HashScroll";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { breadcrumbJsonLd } from "@/lib/seo";
import { FAQS, SITE } from "@/lib/site";
import { getCatalogMakeModels } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About ZervTek Performance | Car Export from Japan",
  description:
    "ZervTek Performance sources, inspects and exports performance cars, supercars and luxury vehicles from Japan. Learn about our company, payment details, and get in touch.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { t: "Quality first", d: "Every vehicle is hand-selected and passes a thorough multi-point inspection at our in-house facility before it is offered." },
  { t: "Radical transparency", d: "Clear pricing and honest condition reporting. Shipping is quoted upfront, with no surprises." },
  { t: "Concierge service", d: "From first enquiry to delivery and beyond, a dedicated specialist looks after you personally." },
];

export default async function AboutPage() {
  const catalog = await getCatalogMakeModels();

  return (
    <main>
      <HashScroll />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "About", url: `${SITE.url}/about` },
        ])}
      />

      <section className="container about-intro">
        <Breadcrumbs
          className="page-breadcrumbs"
          items={[{ label: "Home", href: "/" }, { label: "About" }]}
        />
        <span className="eyebrow">About Us</span>
        <h1 className="heading" style={{ fontSize: "clamp(32px,5vw,52px)", margin: "12px 0 20px", maxWidth: 820 }}>
          The pride for quality, from Japan to the world.
        </h1>
        <p className="muted" style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 720 }}>
          {SITE.name}
          {" "}
          is the performance car division of ZervTek, dedicated to sourcing, preparing and
          exporting performance cars, supercars and luxury vehicles. We combine deep access to Japan&apos;s
          finest cars with meticulous inspection and a genuinely personal service.
        </p>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="about-story-grid">
          <div>
            <h2 className="heading" style={{ fontSize: 28, marginTop: 0 }}>Who we are</h2>
            <div className="muted stack" style={{ gap: 16, lineHeight: 1.8 }}>
              <p style={{ margin: 0 }}>
                Built on years of experience exporting Japanese vehicles worldwide, {SITE.name} was
                created for buyers who want more than a car. They want the right car, in exceptional
                condition, delivered without compromise.
              </p>
              <p style={{ margin: 0 }}>
                We source from across Japan&apos;s leading dealers and auctions, verify every condition
                report, inspect and prepare each vehicle, and manage the full export: documentation,
                customs and shipping to your destination port.
              </p>
              <p style={{ margin: 0 }}>
                All operations remain unified under ZervTek Co., Ltd. This site focuses on
                performance, supercars and luxury marques; our team, accounts and quality standards are the same.
              </p>
            </div>
          </div>
          <CompanyProfile />
        </div>
      </section>

      <MeetUs />

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <span className="eyebrow">Our values</span>
            <h2>Why buyers choose us</h2>
          </div>
        </div>
        <div className="steps">
          {VALUES.map((v) => (
            <div className="step glass" key={v.t}>
              <h4 style={{ marginTop: 0 }}>{v.t}</h4>
              <p>{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <BankDetails />

      <section className="section container" id="contact">
        <div className="section-head section-head-center">
          <div>
            <span className="eyebrow">Contact</span>
            <h2>Get in Touch</h2>
            <p className="muted section-lead">
              Have questions? We&apos;re here to help you find the right car.
            </p>
          </div>
        </div>
        <div className="contact-wrap" id="contact-form">
          <ContactForm catalog={catalog} />
        </div>
      </section>

      <section className="section container" style={{ paddingTop: 0 }} id="faq">
        <div className="section-head">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2>Frequently asked questions</h2>
          </div>
        </div>
        <Faq items={FAQS} />
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="glass" style={{ padding: 40, borderRadius: 0, textAlign: "center" }}>
          <h2 className="heading" style={{ fontSize: 28, marginTop: 0 }}>Ready to find your car?</h2>
          <p className="muted" style={{ maxWidth: 520, margin: "0 auto 24px" }}>
            Browse the collection or speak to a specialist today.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn btn-gold" href="/stock">
              Browse stock
            </Link>
            <WhatsAppLink className="btn btn-outline" location="about_cta">
              WhatsApp us
            </WhatsAppLink>
          </div>
        </div>
      </section>
    </main>
  );
}
