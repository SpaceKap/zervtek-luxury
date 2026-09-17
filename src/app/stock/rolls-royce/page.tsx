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
import { ROLLS_ROYCE_HUB, rollsRoyceStockHref } from "@/lib/make-hubs/rolls-royce";
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

const MAKE = "Rolls-Royce";
const HUB_PATH = "/stock/rolls-royce";

type SP = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const sp = await searchParams;
  if (firstStockParam(sp.model)) {
    return { title: ROLLS_ROYCE_HUB.title, robots: { index: false, follow: true } };
  }

  const page = parseStockPage(firstStockParam(sp.page)) ?? 1;
  const noindex = stockShouldNoIndex(stockQueryFromSp(sp, { make: MAKE }));
  const canonical = stockCanonicalPath(page, {
    make: MAKE,
    hasExtraFilters: noindex,
  });

  return {
    title: page > 1 ? `${ROLLS_ROYCE_HUB.title} | Page ${page}` : ROLLS_ROYCE_HUB.title,
    description: ROLLS_ROYCE_HUB.description,
    alternates: { canonical },
    openGraph: {
      title: ROLLS_ROYCE_HUB.title,
      description: ROLLS_ROYCE_HUB.description,
      url: `${SITE.url}${HUB_PATH}`,
      type: "website",
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

function collectionJsonLd(vehicleCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: ROLLS_ROYCE_HUB.h1,
    description: ROLLS_ROYCE_HUB.description,
    url: `${SITE.url}${HUB_PATH}`,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    about: { "@type": "Brand", name: MAKE },
    numberOfItems: vehicleCount,
  };
}

export default async function RollsRoyceStockHubPage({
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
    const model = resolveCatalogModel(MAKE, modelParam, catalog);
    if (model) {
      permanentRedirect(
        buildStockHref(
          stockQueryFromSp(sp, {
            make: MAKE,
            model,
            page: page > 1 ? String(page) : undefined,
          }),
        ),
      );
    }
    notFound();
  }

  if (pageRaw === "1") {
    permanentRedirect(buildStockHref(stockQueryFromSp(sp, { make: MAKE, page: undefined })));
  }

  const { catalog } = await getStockFilterMeta();
  const filters = filtersFromStockSp(sp, MAKE);

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
          { name: MAKE, url: `${SITE.url}${HUB_PATH}` },
        ])}
      />
      <JsonLd data={collectionJsonLd(total)} />
      <JsonLd data={faqJsonLd([...ROLLS_ROYCE_HUB.faqs])} />
      {items.length > 0 ? <JsonLd data={productListJsonLd(items)} /> : null}

      <div className="container make-hub-shell">
        <header className="stock-hero make-hub-hero">
          <div className="stock-meta">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Stock", href: "/stock" },
                { label: MAKE },
              ]}
            />
            <span>
              {total > 0
                ? `${total} Rolls-Royce${total === 1 ? "" : "s"} in stock`
                : "Sourcing Rolls-Royce cars in Japan"}
            </span>
          </div>
          <h1 className="stock-title">{ROLLS_ROYCE_HUB.h1}</h1>
          <p className="stock-lead make-hub-intro">{ROLLS_ROYCE_HUB.intro}</p>
        </header>

        <section className="make-hub-stock" aria-label="Rolls-Royce stock">
          <Suspense fallback={null}>
            <SearchFilters catalog={catalog} selectedMake={MAKE} selectedModel="" />
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
              <StockViewItemListTracker vehicles={items} listName="rolls_royce_hub" />
              <div className="vehicle-grid stock-grid">
                {items.map((v) => (
                  <VehicleCard key={v.id} v={v} listName="rolls_royce_hub" />
                ))}
              </div>
              <StockPagination page={page} totalPages={totalPages} query={paginationQuery} />
            </>
          ) : (
            <div className="stock-empty glass make-hub-empty">
              <h3>No Rolls-Royce cars listed right now</h3>
              <p className="muted">
                We search Japanese dealer stock and auctions for the Ghost, Phantom, Wraith,
                Dawn, Cullinan and classic Shadows. Tell us what you want.
              </p>
              <div className="stock-source-actions">
                <Link className="btn btn-gold" href="/about#contact-form">
                  Request a Rolls-Royce
                </Link>
                <WhatsAppLink className="btn btn-outline" location="rolls_royce_hub_empty">
                  WhatsApp us
                </WhatsAppLink>
              </div>
            </div>
          )}
        </section>

        <aside className="stock-source-cta glass make-hub-cta">
          <h2 className="heading">{ROLLS_ROYCE_HUB.closing.title}</h2>
          <p className="muted">{ROLLS_ROYCE_HUB.closing.body}</p>
          <div className="stock-source-actions">
            <Link className="btn btn-gold" href="/about#contact-form">
              Contact us
            </Link>
            <WhatsAppLink className="btn btn-outline" location="rolls_royce_hub_cta">
              WhatsApp us
            </WhatsAppLink>
          </div>
        </aside>

        <article className="make-hub-article">
          {ROLLS_ROYCE_HUB.lead.slice(1).map((p) => (
            <p key={p.slice(0, 40)} className="make-hub-prose">
              {p}
            </p>
          ))}

          <section className="make-hub-block" aria-labelledby="short-answer">
            <h2 id="short-answer" className="heading">
              {ROLLS_ROYCE_HUB.shortAnswer.title}
            </h2>
            {ROLLS_ROYCE_HUB.shortAnswer.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="make-hub-prose">
                {p}
              </p>
            ))}
          </section>

          <section className="make-hub-block" aria-labelledby="comparison">
            <h2 id="comparison" className="heading">
              {ROLLS_ROYCE_HUB.comparisonTitle}
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
                  {ROLLS_ROYCE_HUB.comparison.map((row) => (
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

          {ROLLS_ROYCE_HUB.models.map((entry) => (
            <section key={entry.id} id={entry.id} className="make-hub-model">
              <div className="make-hub-model-head">
                <h2 className="heading">
                  {entry.name}: {entry.years}
                </h2>
                <Link className="make-hub-model-link" href={rollsRoyceStockHref(entry.modelFilter)}>
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
              {ROLLS_ROYCE_HUB.howToChoose.title}
            </h2>
            {ROLLS_ROYCE_HUB.howToChoose.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="make-hub-prose">
                {p}
              </p>
            ))}
          </section>
        </article>

        <section className="make-hub-faq" aria-labelledby="rolls-royce-faq">
          <h2 id="rolls-royce-faq" className="heading">
            Frequently asked questions
          </h2>
          <Faq items={[...ROLLS_ROYCE_HUB.faqs]} />
        </section>
      </div>
    </main>
  );
}
