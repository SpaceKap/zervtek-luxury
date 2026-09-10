import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import type { CatalogMake, PublicVehicleCard, VehicleFilters } from "@/lib/vehicles";
import { SearchFilters } from "@/components/SearchFilters";
import { StockSort } from "@/components/StockSort";
import { StockPagination } from "@/components/StockPagination";
import { StockViewItemListTracker } from "@/components/StockViewItemListTracker";
import { VehicleCard } from "@/components/VehicleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, productListJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { stockBrowsePath } from "@/lib/stock";

type Props = {
  items: PublicVehicleCard[];
  total: number;
  page: number;
  totalPages: number;
  catalog: CatalogMake[];
  filters: VehicleFilters;
  title: string;
  lead: string;
  crumbs: { label: string; href?: string }[];
  jsonLdCrumbs: { name: string; url: string }[];
  /** Optional make-model editorial (only when a guide exists). */
  afterStock?: ReactNode;
};

export function StockBrowseView({
  items,
  total,
  page,
  totalPages,
  catalog,
  filters,
  title,
  lead,
  crumbs,
  jsonLdCrumbs,
  afterStock,
}: Props) {
  const paginationQuery = {
    make: filters.make,
    model: filters.model,
    bodyType: filters.bodyType,
    transmission: filters.transmission,
    minYear: filters.minYear != null ? String(filters.minYear) : undefined,
    maxYear: filters.maxYear != null ? String(filters.maxYear) : undefined,
    minMileage: filters.minMileage != null ? String(filters.minMileage) : undefined,
    maxMileage: filters.maxMileage != null ? String(filters.maxMileage) : undefined,
    steering: filters.steering,
    minPrice: filters.minPrice != null ? String(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice != null ? String(filters.maxPrice) : undefined,
    sort: filters.sort && filters.sort !== "newest" ? filters.sort : undefined,
    status: filters.status,
  };

  return (
    <main className={`stock-page${afterStock ? " make-hub-page" : ""}`}>
      <JsonLd data={breadcrumbJsonLd(jsonLdCrumbs)} />
      {items.length > 0 ? <JsonLd data={productListJsonLd(items)} /> : null}

      <header className="stock-hero container">
        <div className="stock-meta">
          <Breadcrumbs items={crumbs} />
          <span>
            {total} vehicle{total === 1 ? "" : "s"}
          </span>
        </div>
        <h1 className="stock-title">{title}</h1>
        <p className="stock-lead">{lead}</p>
      </header>

      <div className="stock-body container">
        <Suspense fallback={null}>
          <SearchFilters
            catalog={catalog}
            selectedMake={filters.make ?? ""}
            selectedModel={filters.model ?? ""}
          />
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
            <StockViewItemListTracker vehicles={items} />
            <div className="vehicle-grid stock-grid">
              {items.map((v) => (
                <VehicleCard key={v.id} v={v} />
              ))}
            </div>
            <StockPagination page={page} totalPages={totalPages} query={paginationQuery} />
          </>
        ) : (
          <div className="stock-empty glass">
            <h2>Can&apos;t find what you&apos;re looking for?</h2>
            <p className="muted">
              Contact us and we will find exactly what you need from auctions and dealerships across
              Japan.
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
          <aside className="stock-source-cta glass make-hub-cta">
            <h2 className="heading">Can&apos;t find what you&apos;re looking for?</h2>
            <p className="muted">
              Contact us and we will find exactly what you&apos;re looking for from Japanese auctions
              and dealerships across Japan.
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

        {afterStock}
      </div>
    </main>
  );
}

export function stockBrowseCopy(make?: string, model?: string) {
  if (make && model) {
    return {
      title: `${make} ${model} stock`,
      lead: `Browse ${make} ${model} listings from Japan — documented and ready to export worldwide.`,
    };
  }
  if (make) {
    return {
      title: `${make} stock`,
      lead: `Browse ${make} performance and luxury vehicles from Japan, ready to ship worldwide.`,
    };
  }
  return {
    title: "The collection",
    lead: "Hand-selected performance and luxury vehicles from Japan, documented and ready to ship worldwide. Inspection support is available on request before you commit.",
  };
}

export function stockBrowseCrumbs(make?: string, model?: string) {
  const crumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
    { label: "Stock", href: make ? "/stock" : undefined },
  ];
  const jsonLdCrumbs: { name: string; url: string }[] = [
    { name: "Home", url: SITE.url },
    { name: "Stock", url: `${SITE.url}/stock` },
  ];
  if (make) {
    crumbs.push({ label: make, href: model ? stockBrowsePath(make) : undefined });
    jsonLdCrumbs.push({ name: make, url: `${SITE.url}${stockBrowsePath(make)}` });
  }
  if (make && model) {
    crumbs.push({ label: model });
    jsonLdCrumbs.push({ name: model, url: `${SITE.url}${stockBrowsePath(make, model)}` });
  }
  return { crumbs, jsonLdCrumbs };
}
