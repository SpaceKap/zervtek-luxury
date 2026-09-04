import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  getStockFilterMeta,
  searchVehicles,
  type VehicleFilters,
} from "@/lib/vehicles";
import { SearchFilters } from "@/components/SearchFilters";
import { StockSort } from "@/components/StockSort";
import { StockInfiniteGrid } from "@/components/StockInfiniteGrid";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, productListJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { STOCK_PAGE_SIZE } from "@/lib/stock";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Performance Car Stock | Browse & Search",
  description:
    "Browse ZervTek Performance's inventory of performance cars, supercars and luxury vehicles from Japan. Filter by make, model and steering: Mercedes-AMG, Porsche, Ferrari, Land Rover and more.",
  alternates: { canonical: "/stock" },
};

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

  const filters: VehicleFilters = {
    q: first(sp.q),
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

  const [{ items, total }, { catalog }] = await Promise.all([
    searchVehicles(filters, 1, STOCK_PAGE_SIZE),
    getStockFilterMeta(),
  ]);

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
        <Suspense fallback={null}>
          <SearchFilters catalog={catalog} />
        </Suspense>

        <div className="stock-results-bar">
          <p className="stock-results-count">
            {total > 0 ? (
              <>
                <strong>{total}</strong> vehicle{total === 1 ? "" : "s"}
              </>
            ) : (
              "No matches"
            )}
          </p>
          <Suspense fallback={null}>
            <StockSort />
          </Suspense>
        </div>

        {items.length > 0 ? (
          <Suspense
            fallback={
              <div className="vehicle-grid stock-grid">
                {items.map((v) => (
                  <div key={v.id} className="vcard" aria-hidden />
                ))}
              </div>
            }
          >
            <StockInfiniteGrid initialItems={items} total={total} />
          </Suspense>
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
