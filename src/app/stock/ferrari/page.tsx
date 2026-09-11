import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
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
  buildStockHref,
  filtersFromStockSp,
  firstStockParam,
  paginationQueryFromFilters,
  parseStockPage,
  resolveCatalogModel,
  stockCanonicalPath,
  stockQueryFromSp,
  stockShouldNoIndex,
} from "@/lib/stock";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const sp = await searchParams;
  // Model spokes live at /stock/ferrari/{model} — never on the make hub.
  if (firstStockParam(sp.model)) {
    return { title: FERRARI_HUB.title, robots: { index: false, follow: true } };
  }

  const page = parseStockPage(firstStockParam(sp.page)) ?? 1;
  const noindex = stockShouldNoIndex(stockQueryFromSp(sp, { make: "Ferrari" }));
  const canonical = stockCanonicalPath(page, {
    make: "Ferrari",
    hasExtraFilters: noindex,
  });

  return {
    title: page > 1 ? `${FERRARI_HUB.title} | Page ${page}` : FERRARI_HUB.title,
    description: FERRARI_HUB.description,
    alternates: { canonical },
    openGraph: {
      title: FERRARI_HUB.title,
      description: FERRARI_HUB.description,
      url: `${SITE.url}/stock/ferrari`,
      type: "website",
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

function collectionJsonLd(vehicleCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: FERRARI_HUB.h1,
    description: FERRARI_HUB.description,
    url: `${SITE.url}/stock/ferrari`,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    about: { "@type": "Brand", name: "Ferrari" },
    numberOfItems: vehicleCount,
  };
}

export default async function FerrariStockHubPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const pageRaw = firstStockParam(sp.page);
  const page = parseStockPage(pageRaw);
  if (page === null) notFound();

  const modelParam = firstStockParam(sp.model);
  if (modelParam) {
    const { catalog } = await getStockFilterMeta();
    const model = resolveCatalogModel("Ferrari", modelParam, catalog);
    if (model) {
      permanentRedirect(
        buildStockHref(
          stockQueryFromSp(sp, {
            make: "Ferrari",
            model,
            page: page > 1 ? String(page) : undefined,
          }),
        ),
      );
    }
    notFound();
  }

  if (pageRaw === "1") {
    permanentRedirect(
      buildStockHref(stockQueryFromSp(sp, { make: "Ferrari", page: undefined })),
    );
  }

  const { catalog } = await getStockFilterMeta();
  const filters = filtersFromStockSp(sp, "Ferrari");

  const { items, total } = await searchVehicles(filters, page, STOCK_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / STOCK_PAGE_SIZE));
  if (page > totalPages) notFound();

  const paginationQuery = paginationQueryFromFilters(filters);

  return (
    <main className="stock-page make-hub-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Stock", url: `${SITE.url}/stock` },
          { name: "Ferrari", url: `${SITE.url}/stock/ferrari` },
        ])}
      />
      <JsonLd data={collectionJsonLd(total)} />
      <JsonLd data={faqJsonLd([...FERRARI_HUB.faqs])} />
      {items.length > 0 ? <JsonLd data={productListJsonLd(items)} /> : null}

      <div className="container make-hub-shell">
        <header className="stock-hero make-hub-hero">
          <div className="stock-meta">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Stock", href: "/stock" },
                { label: "Ferrari" },
              ]}
            />
            <span>
              {total > 0
                ? `${total} Ferrari${total === 1 ? "" : "s"} in stock`
                : "Sourcing Ferraris in Japan"}
            </span>
          </div>
          <h1 className="stock-title">{FERRARI_HUB.h1}</h1>
          <p className="stock-lead make-hub-intro">{FERRARI_HUB.intro}</p>
        </header>

        <section className="make-hub-stock" aria-label="Ferrari stock">
          <Suspense fallback={null}>
            <SearchFilters catalog={catalog} selectedMake="Ferrari" selectedModel="" />
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

        {/* Hub order: stock → CTA (full) → article → FAQ (full). */}
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
        </article>

        <section className="make-hub-faq" aria-labelledby="ferrari-faq">
          <h2 id="ferrari-faq" className="heading">
            Frequently asked questions
          </h2>
          <Faq items={[...FERRARI_HUB.faqs]} />
        </section>
      </div>
    </main>
  );
}
