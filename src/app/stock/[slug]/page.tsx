import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVehicleBySlug } from "@/lib/vehicles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProtectedCarousel } from "@/components/ProtectedCarousel";
import { DetailQuickActions } from "@/components/DetailQuickActions";
import { InquiryForm } from "@/components/InquiryForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, productJsonLd, resolveVehicleMetaDescription, resolveVehicleMetaTitle } from "@/lib/seo";
import { VehiclePrice } from "@/components/Price";
import { formatKm } from "@/lib/format";
import { SITE, whatsappHref } from "@/lib/site";
import {
  BODY_TYPE_LABELS,
  FUEL_LABELS,
  TRANSMISSION_LABELS,
  displayEnum,
} from "@/lib/vehicle-constants";

export const dynamic = "force-dynamic";

function absUrl(src: string): string {
  return src.startsWith("http") ? src : `${SITE.url}${src}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVehicleBySlug(slug);
  if (!v) return { title: "Vehicle not found" };

  const title = resolveVehicleMetaTitle(v);
  const description = resolveVehicleMetaDescription(v);

  return {
    title,
    description,
    alternates: { canonical: `/stock/${v.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE.url}/stock/${v.slug}`,
      images: v.images[0] ? [absUrl(v.images[0])] : undefined,
    },
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = await getVehicleBySlug(slug);
  if (!v) notFound();

  const fullName = `${v.year} ${v.make} ${v.model}${v.variant ? " " + v.variant : ""}`;
  const mailSubject = encodeURIComponent(`Enquiry: ${fullName}`);
  const mailBody = encodeURIComponent(
    `Hi,\n\nI'm interested in the ${fullName}:\n${SITE.url}/stock/${v.slug}\n\n`,
  );
  const mailHref = `mailto:${SITE.email}?subject=${mailSubject}&body=${mailBody}`;
  const waHref = whatsappHref(`Hi, I'm interested in the ${fullName} (${SITE.url}/stock/${v.slug}).`);

  const specs: [string, string | null][] = [
    ["Year", String(v.year)],
    ["Mileage", formatKm(v.mileage)],
    ["Transmission", displayEnum(v.transmission, TRANSMISSION_LABELS) || null],
    ["Fuel", displayEnum(v.fuelType, FUEL_LABELS) || null],
    ["Drivetrain", v.drivetrain || null],
    ["Steering", v.steering || null],
    ["Body type", displayEnum(v.bodyType, BODY_TYPE_LABELS) || null],
    ["Engine", v.engineCc ? `${v.engineCc} cc` : null],
    ["Exterior", v.exteriorColor],
    ["Interior", v.interiorColor],
    ["Location", v.location],
  ];

  return (
    <main className="container" style={{ paddingBlock: 40 }}>
      <JsonLd data={productJsonLd(v)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Stock", url: `${SITE.url}/stock` },
          { name: fullName, url: `${SITE.url}/stock/${v.slug}` },
        ])}
      />

      <Breadcrumbs
        className="page-breadcrumbs"
        items={[
          { label: "Home", href: "/" },
          { label: "Stock", href: "/stock" },
          { label: fullName },
        ]}
      />

      <div className="detail-grid">
        <div className="detail-gallery">
          <ProtectedCarousel images={v.images} alt={fullName} />
        </div>

        <div className="detail-sidebar">
          <div className="glass detail-panel">
            <div className="detail-panel-top">
              <div className="detail-header">
                <span className="vcard-make">{v.make}</span>
                <h1 className="heading detail-title">
                  {v.model}
                  {v.variant ? <span className="muted"> {v.variant}</span> : null}
                </h1>
                {v.status !== "AVAILABLE" ? (
                  <span className="pill detail-status">Status: {v.status}</span>
                ) : null}
              </div>

              <div className="detail-price-row">
                <VehiclePrice price={v.price} />
                <DetailQuickActions
                  waHref={waHref}
                  mailHref={mailHref}
                  shareUrl={`${SITE.url}/stock/${v.slug}`}
                  shareTitle={fullName}
                />
              </div>
            </div>

            <div className="detail-panel-divider" />

            <div className="detail-panel-scroll">
              <div className="detail-enquiry-head">
                <h2 className="heading">Send an enquiry</h2>
                <p className="muted">A specialist will confirm availability and share the condition report.</p>
              </div>
              <InquiryForm vehicleId={v.id} vehicleName={fullName} compact embedded />
            </div>
          </div>
        </div>
      </div>

      {/* Specs */}
      <section className="section" style={{ paddingBottom: 40 }}>
        <h2 className="heading" style={{ fontSize: 26, marginBottom: 20 }}>
          Specifications
        </h2>
        <dl className="spec-list">
          {specs
            .filter(([, val]) => val)
            .map(([label, val]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{val}</dd>
              </div>
            ))}
        </dl>
      </section>

      {/* Description */}
      <section style={{ paddingBottom: 40 }}>
        <h2 className="heading" style={{ fontSize: 26, marginBottom: 16 }}>
          About this {v.make} {v.model}
        </h2>
        <p style={{ lineHeight: 1.85, whiteSpace: "pre-line", maxWidth: 820 }} className="muted">
          {v.description}
        </p>
      </section>

      {/* Features */}
      {v.features.length > 0 ? (
        <section style={{ paddingBottom: 40 }}>
          <h2 className="heading" style={{ fontSize: 26, marginBottom: 16 }}>
            Highlights &amp; equipment
          </h2>
          <div className="pill-row">
            {v.features.map((f) => (
              <span className="pill" key={f}>
                {f}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
