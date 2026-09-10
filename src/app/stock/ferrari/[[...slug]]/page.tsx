import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getStockFilterMeta, searchVehicles } from "@/lib/vehicles";
import { VehicleCard } from "@/components/VehicleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Faq } from "@/components/Faq";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { SearchFilters } from "@/components/SearchFilters";
import { StockPagination } from "@/components/StockPagination";
import { StockSort } from "@/components/StockSort";
import { StockViewItemListTracker } from "@/components/StockViewItemListTracker";
import { breadcrumbJsonLd, faqJsonLd, productListJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { FERRARI_HUB, ferrariStockHref } from "@/lib/make-hubs/ferrari";
import {
  STOCK_PAGE_SIZE,
  parseStockPage,
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

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const { slug = [] } = await params;
  const sp = await searchParams;
  const { catalog } = await getStockFilterMeta();
  const model = slug[0] ? resolveCatalogModel("Ferrari", slug[0], catalog) ?? undefined : undefined;
  if (slug.length > 1) {
    return { title: "Stock not found", robots: { index: false, follow: false } };
  }
  if (slug[0] && !model) {
    return { title: "Stock not found", robots: { index: false, follow: false } };
  }

  const page = parseStockPage(first(sp.page)) ?? 1;
  const noindex = stockShouldNoIndex({
    steering: first(sp.steering),
    sort: first(sp.sort),
    status: first(sp.status),
  });
  const canonical = stockCanonicalPath(page, {
    make: "Ferrari",
    model: model ?? undefined,
    hasExtraFilters: noindex,
  });

  const titleBase = model
    ? `${model} Ferrari for Sale from Japan`
    : FERRARI_HUB.title;

  return {
    title: page > 1 ? `${titleBase} | Page ${page}` : titleBase,
    description: FERRARI_HUB.description,
    alternates: { canonical },
    openGraph: {
      title: titleBase,
      description: FERRARI_HUB.description,
      url: `${SITE.url}${stockBrowsePath("Ferrari", model ?? undefined)}`,
      type: "website",
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

function collectionJsonLd(vehicleCount: number, model?: string) {
  const url = `${SITE.url}${stockBrowsePath("Ferrari", model)}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: model ? `${model} Ferrari stock` : FERRARI_HUB.h1,
    description: FERRARI_HUB.description,
    url,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    about: { "@type": "Brand", name: "Ferrari" },
    numberOfItems: vehicleCount,
  };
}

export default async function FerrariStockHubPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<SP>;
}) {
  const { slug = [] } = await params;
  const sp = await searchParams;
  if (slug.length > 1) notFound();

  const pageRaw = first(sp.page);
  const page = parseStockPage(pageRaw);
  if (page === null) notFound();

  const { catalog } = await getStockFilterMeta();
  const modelRaw = slug[0] ? resolveCatalogModel("Ferrari", slug[0], catalog) : undefined;
  const model = modelRaw ?? undefined;
  if (slug[0] && !model) notFound();

  const steering = first(sp.steering);
  const sort = (first(sp.sort) as "newest" | "price_asc" | "price_desc" | "year_desc") ?? "newest";

  const { items, total } = await searchVehicles(
    { make: "Ferrari", model, sort, steering },
    page,
    STOCK_PAGE_SIZE,
  );
  const totalPages = Math.max(1, Math.ceil(total / STOCK_PAGE_SIZE));
  if (page > totalPages) notFound();

  const paginationQuery = {
    make: "Ferrari",
    model,
    steering,
    sort: sort !== "newest" ? sort : undefined,
  };

  const crumbItems = [
    { label: "Home", href: "/" },
    { label: "Stock", href: "/stock" },
    { label: "Ferrari", href: model ? "/stock/ferrari" : undefined },
    ...(model ? [{ label: model }] : []),
  ];

  return (
    <main className="stock-page make-hub-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Stock", url: `${SITE.url}/stock` },
          { name: "Ferrari", url: `${SITE.url}/stock/ferrari` },
          ...(model
            ? [{ name: model, url: `${SITE.url}${stockBrowsePath("Ferrari", model)}` }]
            : []),
        ])}
      />
      <JsonLd data={collectionJsonLd(total, model)} />
      <JsonLd data={faqJsonLd([...FERRARI_HUB.faqs])} />
      {items.length > 0 ? <JsonLd data={productListJsonLd(items)} /> : null}

      <div className="container make-hub-shell">
        <header className="stock-hero make-hub-hero">
          <div className="stock-meta">
            <Breadcrumbs items={crumbItems} />
            <span>
              {total > 0
                ? `${total} Ferrari${total === 1 ? "" : "s"}${model ? ` · ${model}` : ""} in stock`
                : "Sourcing Ferraris in Japan"}
            </span>
          </div>
          <h1 className="stock-title">{FERRARI_HUB.h1}</h1>
          <p className="stock-lead make-hub-intro">{FERRARI_HUB.intro}</p>
        </header>

        <section className="make-hub-stock" aria-label="Ferrari stock">
          <Suspense fallback={null}>
            <SearchFilters
              catalog={catalog}
              selectedMake="Ferrari"
              selectedModel={model ?? ""}
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
              <StockViewItemListTracker vehicles={items} listName="ferrari_hub" />
              <div className="vehicle-grid stock-grid">
                {items.map((v) => (
                  <VehicleCard key={v.id} v={v} listName="ferrari_hub" />
                ))}
              </div>
              <StockPagination page={page} totalPages={totalPages} query={paginationQuery} />
            </>
          ) : (
            <div className="stock-empty glass make-hub-empty">
              <h3>No Ferraris listed right now</h3>
              <p className="muted">
                We search Japanese dealer stock and auctions for the 308, F355, 360, 458, Testarossa,
                F12 and more. Tell us what you want.
              </p>
              <div className="stock-source-actions">
                <Link className="btn btn-gold" href="/about#contact-form">
                  Request a Ferrari
                </Link>
                <WhatsAppLink className="btn btn-outline" location="ferrari_hub_empty">
                  WhatsApp us
                </WhatsAppLink>
              </div>
            </div>
          )}
        </section>

        <article className="make-hub-article">
          {FERRARI_HUB.lead.slice(1).map((p) => (
            <p key={p.slice(0, 40)} className="make-hub-prose">
              {p}
            </p>
          ))}

          <section className="make-hub-block" aria-labelledby="short-answer">
            <h2 id="short-answer" className="heading">
              {FERRARI_HUB.shortAnswer.title}
            </h2>
            {FERRARI_HUB.shortAnswer.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="make-hub-prose">
                {p}
              </p>
            ))}
          </section>

          <section className="make-hub-block" aria-labelledby="comparison">
            <h2 id="comparison" className="heading">
              Ten Ferraris worth searching for
            </h2>
            <div className="make-hub-table-wrap">
              <table className="make-hub-table">
                <thead>
                  <tr>
                    <th scope="col">If you want…</th>
                    <th scope="col">Look at…</th>
                  </tr>
                </thead>
                <tbody>
                  {FERRARI_HUB.comparison.map((row) => (
                    <tr key={row.model}>
                      <td>{row.want}</td>
                      <td>
                        <a href={`#${row.anchor}`}>{row.model}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {FERRARI_HUB.models.map((entry) => (
            <section key={entry.id} id={entry.id} className="make-hub-model">
              <div className="make-hub-model-head">
                <h2 className="heading">
                  {entry.name}: {entry.years}
                </h2>
                <Link className="make-hub-model-link" href={ferrariStockHref(entry.modelFilter)}>
                  Search stock
                </Link>
              </div>
              {entry.paragraphs.map((p) => (
                <p key={p.slice(0, 48)} className="make-hub-prose">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <section className="make-hub-block" aria-labelledby="how-to-choose">
            <h2 id="how-to-choose" className="heading">
              {FERRARI_HUB.howToChoose.title}
            </h2>
            {FERRARI_HUB.howToChoose.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="make-hub-prose">
                {p}
              </p>
            ))}
          </section>

          <section className="make-hub-block" aria-labelledby="ferrari-faq">
            <h2 id="ferrari-faq" className="heading">
              Frequently asked questions
            </h2>
            <Faq items={[...FERRARI_HUB.faqs]} />
          </section>
        </article>

        <aside className="stock-source-cta glass make-hub-cta">
          <h2 className="heading">{FERRARI_HUB.closing.title}</h2>
          <p className="muted">{FERRARI_HUB.closing.body}</p>
          <div className="stock-source-actions">
            <Link className="btn btn-gold" href="/about#contact-form">
              Contact us
            </Link>
            <WhatsAppLink className="btn btn-outline" location="ferrari_hub_cta">
              WhatsApp us
            </WhatsAppLink>
          </div>
        </aside>
      </div>
    </main>
  );
}
