import type { Metadata } from "next";
import Link from "next/link";
import {
  getStockFilterCatalog,
  getStockMileageBounds,
  getStockYearBounds,
  searchVehicles,
  type VehicleFilters,
} from "@/lib/vehicles";
import { VehicleCard } from "@/components/VehicleCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, productListJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { WhatsAppLink } from "@/components/WhatsAppLink";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Performance Car Stock | Browse & Search",
  description:
    "Browse ZervTek Performance's inventory of performance cars, supercars and luxury vehicles from Japan. Filter by make, model, year and body type: Mercedes-AMG, Porsche, Ferrari, Land Rover and more.",
  alternates: { canonical: "/stock" },
};

const PAGE_SIZE = 12;

type SP = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(first(sp.page) ?? "1", 10) || 1);

  const filters: VehicleFilters = {
    make: first(sp.make),
    model: first(sp.model),
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

  const [{ items, total }, catalog, yearBounds, mileageBounds] = await Promise.all([
    searchVehicles(filters, page, PAGE_SIZE),
    getStockFilterCatalog(),
    getStockYearBounds(),
    getStockMileageBounds(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);

  const buildPageHref = (p: number) => {
    const next = new URLSearchParams();
    Object.entries(sp).forEach(([k, v]) => {
      const val = first(v);
      if (val && k !== "page") next.set(k, val);
    });
    next.set("page", String(p));
    return `/stock?${next.toString()}`;
  };

  return (
    <main className="stock-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Stock", url: `${SITE.url}/stock` },
        ])}
      />
      {items.length > 0 && <JsonLd data={productListJsonLd(items)} />}

      <header className="stock-hero container">
        <div className="stock-meta">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Stock" }]} />
          <span>{total} vehicles</span>
        </div>
        <h1 className="stock-title">The collection</h1>
        <p className="stock-lead">
          Hand-selected performance and luxury vehicles from Japan, inspected, documented and ready
          to ship worldwide.
        </p>
      </header>

      <div className="stock-body container">
        <SearchFilters catalog={catalog} yearBounds={yearBounds} mileageBounds={mileageBounds} />

        <div className="stock-results-bar">
          <p className="stock-results-count">
            {total > 0 ? (
              <>
                Showing <strong>{showingFrom}–{showingTo}</strong> of <strong>{total}</strong>
              </>
            ) : (
              "No matches"
            )}
          </p>
        </div>

        {items.length > 0 ? (
          <>
            <div className="vehicle-grid stock-grid">
              {items.map((v) => (
                <VehicleCard key={v.id} v={v} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="stock-pagination" aria-label="Stock pagination">
                {page > 1 ? (
                  <Link className="btn btn-outline" href={buildPageHref(page - 1)}>
                    Previous
                  </Link>
                ) : (
                  <span className="stock-pagination-spacer" />
                )}
                <span className="stock-pagination-label">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages ? (
                  <Link className="btn btn-outline" href={buildPageHref(page + 1)}>
                    Next
                  </Link>
                ) : (
                  <span className="stock-pagination-spacer" />
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="stock-empty glass">
            <h2>Can&apos;t find what you&apos;re looking for?</h2>
            <p className="muted">
              Contact us and we will find exactly what you need from auctions and
              dealerships across Japan.
            </p>
            <div className="stock-source-actions">
              <Link className="btn btn-gold" href="/about#contact-form">
                Contact us
              </Link>
              <WhatsAppLink className="btn btn-outline" location="stock_empty">
                WhatsApp us
              </WhatsAppLink>
            </div>
          </div>
        )}

        {items.length > 0 ? (
          <aside className="stock-source-cta glass">
            <h2 className="heading">Can&apos;t find what you&apos;re looking for?</h2>
            <p className="muted">
              Contact us and we will find exactly what you&apos;re looking for from
              Japanese auctions and dealerships across Japan.
            </p>
            <div className="stock-source-actions">
              <Link className="btn btn-gold" href="/about#contact-form">
                Contact us
              </Link>
              <WhatsAppLink className="btn btn-outline" location="stock_source_cta">
                WhatsApp us
              </WhatsAppLink>
            </div>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
