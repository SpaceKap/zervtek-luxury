import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import {
  getRelatedVehicles,
  getStockFilterMeta,
  getVehicleBySlug,
  getVehicleBySlugAdmin,
  findSlugRedirect,
  searchVehicles,
  type VehicleFilters,
} from "@/lib/vehicles";
import { VehicleCard } from "@/components/VehicleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProtectedCarousel } from "@/components/ProtectedCarousel";
import { DetailQuickActions } from "@/components/DetailQuickActions";
import { InquiryForm } from "@/components/InquiryForm";
import { ViewItemTracker } from "@/components/ViewItemTracker";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  productJsonLd,
  resolveVehicleMetaDescription,
  resolveVehicleMetaTitle,
} from "@/lib/seo";
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
import Link from "next/link";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import {
  StockBrowseView,
  stockBrowseCopy,
  stockBrowseCrumbs,
} from "@/components/StockBrowseView";
import {
  STOCK_PAGE_SIZE,
  buildStockHref,
  parseStockPage,
  resolveCatalogMake,
  resolveCatalogModel,
  stockBrowsePath,
  stockCanonicalPath,
  stockShouldNoIndex,
} from "@/lib/stock";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function absUrl(src: string): string {
  return src.startsWith("http") ? src : `${SITE.url}${src}`;
}

function isVehicleDetailPath(path: string[]): boolean {
  return path.length === 3 && Boolean(path[2]?.endsWith("-for-sale"));
}

function filtersFromSp(sp: SP, make?: string, model?: string): VehicleFilters {
  return {
    q: first(sp.q),
    make,
    model,
    bodyType: first(sp.bodyType),
    transmission: first(sp.transmission),
    minYear: first(sp.minYear) ? Number(first(sp.minYear)) : undefined,
    maxYear: first(sp.maxYear) ? Number(first(sp.maxYear)) : undefined,
    minMileage: first(sp.minMileage) ? Number(first(sp.minMileage)) : undefined,
    maxMileage: first(sp.maxMileage) ? Number(first(sp.maxMileage)) : undefined,
    steering: first(sp.steering),
    minPrice: first(sp.minPrice) ? Number(first(sp.minPrice)) : undefined,
    maxPrice: first(sp.maxPrice) ? Number(first(sp.maxPrice)) : undefined,
    sort: (first(sp.sort) as VehicleFilters["sort"]) ?? "newest",
    status: first(sp.status),
  };
}

async function resolveVehicle(path: string[]) {
  const slug = slugFromStockPath(path);
  if (!slug) return null;
  const vehicle = await getVehicleBySlug(slug);
  if (vehicle) return vehicle;

  const redirected = await findSlugRedirect(slug);
  if (redirected) {
    permanentRedirect(vehicleStockPath(redirected));
  }
  return null;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ path: string[] }>;
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const { path } = await params;
  const sp = await searchParams;

  if (isVehicleDetailPath(path)) {
    const v = await resolveVehicle(path);
    if (!v) return { title: "Vehicle not found", robots: { index: false, follow: false } };
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

  if (path.length === 1 || path.length === 2) {
    const { catalog } = await getStockFilterMeta();
    const make = resolveCatalogMake(path[0], catalog);

    if (path.length === 1 && !make) {
      const v = await resolveVehicle(path);
      if (v) {
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
      return { title: "Stock not found", robots: { index: false, follow: false } };
    }

    if (!make) return { title: "Stock not found", robots: { index: false, follow: false } };
    const model =
      path.length === 2 ? resolveCatalogModel(make, path[1], catalog) : undefined;
    if (path.length === 2 && !model) {
      return { title: "Stock not found", robots: { index: false, follow: false } };
    }

    const page = parseStockPage(first(sp.page));
    if (page === null) {
      return { title: "Stock not found", robots: { index: false, follow: false } };
    }

    const noindex = stockShouldNoIndex({
      q: first(sp.q),
      bodyType: first(sp.bodyType),
      transmission: first(sp.transmission),
      minYear: first(sp.minYear),
      maxYear: first(sp.maxYear),
      minMileage: first(sp.minMileage),
      maxMileage: first(sp.maxMileage),
      steering: first(sp.steering),
      minPrice: first(sp.minPrice),
      maxPrice: first(sp.maxPrice),
      sort: first(sp.sort),
      status: first(sp.status),
    });
    const canonical = stockCanonicalPath(page, {
      make,
      model: model ?? undefined,
      hasExtraFilters: noindex,
    });
    const copy = stockBrowseCopy(make, model ?? undefined);
    return {
      title: `${copy.title} | ${SITE.name}`,
      description: copy.lead,
      alternates: { canonical },
      robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    };
  }

  return { title: "Vehicle not found", robots: { index: false, follow: false } };
}

async function renderBrowse(path: string[], sp: SP) {
  const pageRaw = first(sp.page);
  const page = parseStockPage(pageRaw);
  if (page === null) notFound();

  const { catalog } = await getStockFilterMeta();
  const make = resolveCatalogMake(path[0], catalog);
  if (!make) notFound();

  let model: string | undefined;
  if (path.length === 2) {
    const resolved = resolveCatalogModel(make, path[1], catalog);
    if (!resolved) notFound();
    model = resolved;
  }

  // Drop stale make/model query params onto clean path.
  if (first(sp.make) || first(sp.model)) {
    permanentRedirect(
      buildStockHref({
        make,
        model,
        q: first(sp.q),
        bodyType: first(sp.bodyType),
        transmission: first(sp.transmission),
        minYear: first(sp.minYear),
        maxYear: first(sp.maxYear),
        minMileage: first(sp.minMileage),
        maxMileage: first(sp.maxMileage),
        steering: first(sp.steering),
        minPrice: first(sp.minPrice),
        maxPrice: first(sp.maxPrice),
        sort: first(sp.sort),
        status: first(sp.status),
        page: page > 1 ? String(page) : undefined,
      }),
    );
  }

  if (pageRaw === "1") {
    permanentRedirect(
      buildStockHref({
        make,
        model,
        steering: first(sp.steering),
        sort: first(sp.sort),
        status: first(sp.status),
      }),
    );
  }

  const filters = filtersFromSp(sp, make, model);
  const { items, total } = await searchVehicles(filters, page, STOCK_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / STOCK_PAGE_SIZE));
  if (page > totalPages) notFound();

  const copy = stockBrowseCopy(make, model);
  const { crumbs, jsonLdCrumbs } = stockBrowseCrumbs(make, model);

  return (
    <StockBrowseView
      items={items}
      total={total}
      page={page}
      totalPages={totalPages}
      catalog={catalog}
      filters={filters}
      title={copy.title}
      lead={copy.lead}
      crumbs={crumbs}
      jsonLdCrumbs={jsonLdCrumbs}
    />
  );
}

async function renderVehicleDetail(path: string[]) {
  const slug = slugFromStockPath(path);

  if (path.length === 1 && slug) {
    const admin = await getVehicleBySlugAdmin(slug);
    if (admin && admin.slug.includes("/")) {
      redirect(vehicleStockPath(admin.slug));
    }
  }

  const v = slug ? await getVehicleBySlug(slug) : null;
  if (!v) {
    if (slug) {
      const redirected = await findSlugRedirect(slug);
      if (redirected) permanentRedirect(vehicleStockPath(redirected));
    }
    notFound();
  }

  const related = await getRelatedVehicles(v, 4);

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
  const makeHref = stockBrowsePath(v.make);
  const modelHref = stockBrowsePath(v.make, v.model);

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
                  {v.year} {v.make} {v.model}
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
              {v.status === "SOLD" ? (
                <div className="detail-enquiry-head">
                  <h2 className="heading">This vehicle is sold</h2>
                  <p className="muted">
                    We can source a similar {v.make} {v.model} from Japan. Tell us your destination
                    and preferred specification.
                  </p>
                  <div
                    className="stock-source-actions"
                    style={{ marginTop: 16, justifyContent: "flex-start" }}
                  >
                    <Link className="btn btn-gold" href="/about#contact-form">
                      Request similar
                    </Link>
                    <WhatsAppLink className="btn btn-outline" location="vehicle_sold">
                      WhatsApp us
                    </WhatsAppLink>
                  </div>
                </div>
              ) : (
                <>
                  <div className="detail-enquiry-head">
                    <h2 className="heading">Send an enquiry</h2>
                    <p className="muted">
                      A specialist will confirm availability. Inspection support is available on
                      request.
                    </p>
                  </div>
                  <InquiryForm
                    vehicleId={v.id}
                    vehicleName={fullName}
                    vehicleMake={v.make}
                    formLocation="vehicle_detail"
                    compact
                    embedded
                  />
                </>
              )}
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

      {related.length > 0 ? (
        <section className="related-section" style={{ paddingBottom: 40 }}>
          <h2 className="heading" style={{ fontSize: 26, marginBottom: 20 }}>
            Similar vehicles
          </h2>
          <div className="related-scroller" role="list">
            {related.map((item) => (
              <div key={item.id} className="related-scroller-item" role="listitem">
                <VehicleCard v={item} listName="related_vehicles" />
              </div>
            ))}
          </div>
          <p style={{ marginTop: 16 }}>
            <Link className="btn btn-outline" href={makeHref}>
              More {v.make} stock →
            </Link>
          </p>
        </section>
      ) : null}
    </main>
  );
}

export default async function StockPathPage({
  params,
  searchParams,
}: {
  params: Promise<{ path: string[] }>;
  searchParams: Promise<SP>;
}) {
  const { path } = await params;
  const sp = await searchParams;

  if (isVehicleDetailPath(path)) {
    return renderVehicleDetail(path);
  }

  if (path.length === 1) {
    const { catalog } = await getStockFilterMeta();
    const make = resolveCatalogMake(path[0], catalog);
    if (make) return renderBrowse(path, sp);
    // Legacy flat vehicle slug
    return renderVehicleDetail(path);
  }

  if (path.length === 2) {
    return renderBrowse(path, sp);
  }

  notFound();
}
