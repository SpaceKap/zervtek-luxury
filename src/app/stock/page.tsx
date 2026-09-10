import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getStockFilterMeta,
  searchVehicles,
  type VehicleFilters,
} from "@/lib/vehicles";
import { SearchFilters } from "@/components/SearchFilters";
import { StockSort } from "@/components/StockSort";
import { StockInfiniteGrid } from "@/components/StockInfiniteGrid";
import { StockPagination } from "@/components/StockPagination";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, productListJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import {
  STOCK_PAGE_SIZE,
  parseStockPage,
  stockCanonicalPath,
  stockShouldNoIndex,
} from "@/lib/stock";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function filtersFromSp(sp: SP): VehicleFilters {
  return {
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
}

function queryStrings(sp: SP) {
  return {
    q: first(sp.q),
    make: first(sp.make),
    model: first(sp.model),
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
    page: first(sp.page),
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const page = parseStockPage(first(sp.page));
  if (page === null) {
    return { title: "Stock not found", robots: { index: false, follow: false } };
  }

  const qs = queryStrings(sp);
  const noindex = stockShouldNoIndex(qs);
  const canonical = stockCanonicalPath(page, noindex);
  const title =
    page > 1
      ? `Performance Car Stock | Page ${page}`
      : "Performance Car Stock | Browse & Search";

  return {
    title,
    description:
      "Browse ZervTek Performance's inventory of performance cars, supercars and luxury vehicles from Japan. Filter by make, model and steering: Mercedes-AMG, Porsche, Ferrari, Land Rover and more.",
    alternates: { canonical },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const pageRaw = first(sp.page);
  const page = parseStockPage(pageRaw);
  if (page === null) notFound();

  // Normalize ?page=1 to clean /stock (preserve other params).
  if (pageRaw === "1") {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      const val = first(v);
      if (!val || k === "page") continue;
      next.set(k, val);
    }
    const qs = next.toString();
    permanentRedirect(qs ? `/stock?${qs}` : "/stock");
  }

  // Exact make-only Ferrari filter → permanent make hub.
  const makeOnly =
    first(sp.make)?.toLowerCase() === "ferrari" &&
    !first(sp.model) &&
    !first(sp.q) &&
    !first(sp.bodyType) &&
    !first(sp.steering) &&
    !first(sp.minYear) &&
    !first(sp.maxYear) &&
    !first(sp.minMileage) &&
    !first(sp.maxMileage) &&
    !first(sp.minPrice) &&
    !first(sp.maxPrice) &&
    !first(sp.transmission) &&
    !first(sp.status) &&
    (!first(sp.sort) || first(sp.sort) === "newest") &&
    page === 1;
  if (makeOnly) permanentRedirect("/stock/ferrari");

  const filters = filtersFromSp(sp);
  const qs = queryStrings(sp);

  const [{ items, total }, { catalog }] = await Promise.all([
    searchVehicles(filters, page, STOCK_PAGE_SIZE),
    getStockFilterMeta(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / STOCK_PAGE_SIZE));
  if (page > totalPages) notFound();

  const paginationQuery = {
    q: qs.q,
    make: qs.make,
    model: qs.model,
    bodyType: qs.bodyType,
    transmission: qs.transmission,
    minYear: qs.minYear,
    maxYear: qs.maxYear,
    minMileage: qs.minMileage,
    maxMileage: qs.maxMileage,
    steering: qs.steering,
    minPrice: qs.minPrice,
    maxPrice: qs.maxPrice,
    sort: qs.sort && qs.sort !== "newest" ? qs.sort : undefined,
    status: qs.status,
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
          Hand-selected performance and luxury vehicles from Japan, documented and ready to ship
          worldwide. Inspection support is available on request before you commit.
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
                {totalPages > 1 ? (
                  <>
                    {" "}
                    · page <strong>{page}</strong> of <strong>{totalPages}</strong>
                  </>
                ) : null}
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
          <>
            <Suspense
              fallback={
                <div className="vehicle-grid stock-grid">
                  {items.map((v) => (
                    <div key={v.id} className="vcard" aria-hidden />
                  ))}
                </div>
              }
            >
              <StockInfiniteGrid initialItems={items} total={total} initialPage={page} />
            </Suspense>
            <StockPagination page={page} totalPages={totalPages} query={paginationQuery} />
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
