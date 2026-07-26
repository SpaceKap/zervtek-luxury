import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getVehicleBySlug, getVehicleBySlugAdmin } from "@/lib/vehicles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProtectedCarousel } from "@/components/ProtectedCarousel";
import { DetailQuickActions } from "@/components/DetailQuickActions";
import { InquiryForm } from "@/components/InquiryForm";
import { ViewItemTracker } from "@/components/ViewItemTracker";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, productJsonLd, resolveVehicleMetaDescription, resolveVehicleMetaTitle } from "@/lib/seo";
import { VehiclePrice } from "@/components/Price";
import { formatKm } from "@/lib/format";
import { SITE, whatsappHref } from "@/lib/site";
import { slugFromStockPath, vehicleStockPath } from "@/lib/slug";
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

async function resolveVehicle(path: string[]) {
  const slug = slugFromStockPath(path);
  if (!slug) return null;
  return getVehicleBySlug(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string[] }>;
}): Promise<Metadata> {
  const { path } = await params;
  const v = await resolveVehicle(path);
  if (!v) return { title: "Vehicle not found" };

  const title = resolveVehicleMetaTitle(v);
  const description = resolveVehicleMetaDescription(v);
  const href = vehicleStockPath(v.slug);

  return {
    title,
    description,
    alternates: { canonical: href },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE.url}${href}`,
      images: v.images[0] ? [absUrl(v.images[0])] : undefined,
    },
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const slug = slugFromStockPath(path);

  // Legacy flat slug → redirect to new make/model/grade-for-sale path when stored that way
  if (path.length === 1 && slug) {
    const admin = await getVehicleBySlugAdmin(slug);
    if (admin && admin.slug.includes("/")) {
      redirect(vehicleStockPath(admin.slug));
    }
  }

  const v = slug ? await getVehicleBySlug(slug) : null;
  if (!v) notFound();

  const href = vehicleStockPath(v.slug);
  const abs = `${SITE.url}${href}`;
  const fullName = `${v.year} ${v.make} ${v.model}${v.variant ? " " + v.variant : ""}`;
  const mailSubject = encodeURIComponent(`Enquiry: ${fullName}`);
  const mailBody = encodeURIComponent(
    `Hi,\n\nI'm interested in the ${fullName}:\n${abs}\n\n`,
  );
  const mailHref = `mailto:${SITE.email}?subject=${mailSubject}&body=${mailBody}`;
  const waHref = whatsappHref(`Hi, I'm interested in the ${fullName} (${abs}).`);

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

  const gradeLabel = (v.variant || v.model).trim();

  const makeHref = `/stock?make=${encodeURIComponent(v.make)}`;
  const modelHref = `/stock?make=${encodeURIComponent(v.make)}&q=${encodeURIComponent(v.model)}`;

  const crumbItems = [
    { label: "Home", href: "/" },
    { label: "Stock", href: "/stock" },
    { label: v.make, href: makeHref },
    { label: v.model, href: modelHref },
    { label: gradeLabel },
  ];

  const jsonLdCrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Stock", url: `${SITE.url}/stock` },
    { name: v.make, url: `${SITE.url}${makeHref}` },
    { name: v.model, url: `${SITE.url}${modelHref}` },
    { name: gradeLabel, url: abs },
  ];

  return (
    <main className="container" style={{ paddingBlock: 40 }}>
      <JsonLd data={productJsonLd(v)} />
      <JsonLd data={breadcrumbJsonLd(jsonLdCrumbs)} />
      <ViewItemTracker
        vehicle={{
          id: v.id,
          make: v.make,
          model: v.model,
          variant: v.variant,
          year: v.year,
          price: v.price,
          bodyType: v.bodyType,
          slug: v.slug,
        }}
      />

      <Breadcrumbs className="page-breadcrumbs" items={crumbItems} />

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
                  shareUrl={abs}
                  shareTitle={fullName}
                  vehicleId={v.id}
                  vehicleName={fullName}
                />
              </div>
            </div>

            <div className="detail-panel-divider" />

            <div className="detail-panel-scroll">
              <div className="detail-enquiry-head">
                <h2 className="heading">Send an enquiry</h2>
                <p className="muted">A specialist will confirm availability and share the condition report.</p>
              </div>
              <InquiryForm
                vehicleId={v.id}
                vehicleName={fullName}
                formLocation="vehicle_detail"
                compact
                embedded
              />
            </div>
          </div>
        </div>
      </div>

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

      <section style={{ paddingBottom: 40 }}>
        <h2 className="heading" style={{ fontSize: 26, marginBottom: 16 }}>
          About this {v.make} {v.model}
        </h2>
        <p style={{ lineHeight: 1.85, whiteSpace: "pre-line", maxWidth: 820 }} className="muted">
          {v.description}
        </p>
      </section>

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
