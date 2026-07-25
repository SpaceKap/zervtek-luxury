import type { Metadata } from "next";
import Link from "next/link";
import { searchVehicles, type VehicleFilters } from "@/lib/vehicles";
import { VehicleCard } from "@/components/VehicleCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, productListJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Luxury Car Stock — Browse & Search",
  description:
    "Browse ZervTek Luxury's inventory of premium and performance vehicles from Japan. Search by make, body type and price — Mercedes-AMG, Porsche, Ferrari, Land Rover and more.",
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
    q: first(sp.q),
    make: first(sp.make),
    bodyType: first(sp.bodyType),
    transmission: first(sp.transmission),
    minPrice: first(sp.minPrice) ? Number(first(sp.minPrice)) : undefined,
    maxPrice: first(sp.maxPrice) ? Number(first(sp.maxPrice)) : undefined,
    sort: (first(sp.sort) as VehicleFilters["sort"]) ?? "newest",
    status: first(sp.status),
  };

  const { items, total } = await searchVehicles(filters, page, PAGE_SIZE);
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
          Hand-selected performance and luxury vehicles from Japan — inspected, documented and ready
          to ship worldwide.
        </p>
      </header>

      <div className="stock-body container">
        <SearchFilters />

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
            <h2>No vehicles found</h2>
            <p className="muted">
              Try adjusting your filters or{" "}
              <Link href="/stock" className="gold-text">
                view all stock
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
