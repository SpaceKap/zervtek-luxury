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
import { LAMBORGHINI_HUB, lamborghiniStockHref } from "@/lib/make-hubs/lamborghini";
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

const MAKE = "Lamborghini";
const HUB_PATH = "/stock/lamborghini";

type SP = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const sp = await searchParams;
  if (firstStockParam(sp.model)) {
    return { title: LAMBORGHINI_HUB.title, robots: { index: false, follow: true } };
  }

  const page = parseStockPage(firstStockParam(sp.page)) ?? 1;
  const noindex = stockShouldNoIndex(stockQueryFromSp(sp, { make: MAKE }));
  const canonical = stockCanonicalPath(page, {
    make: MAKE,
    hasExtraFilters: noindex,
  });

  return {
    title: page > 1 ? `${LAMBORGHINI_HUB.title} | Page ${page}` : LAMBORGHINI_HUB.title,
    description: LAMBORGHINI_HUB.description,
    alternates: { canonical },
    openGraph: {
      title: LAMBORGHINI_HUB.title,
      description: LAMBORGHINI_HUB.description,
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
    name: LAMBORGHINI_HUB.h1,
    description: LAMBORGHINI_HUB.description,
    url: `${SITE.url}${HUB_PATH}`,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    about: { "@type": "Brand", name: MAKE },
    numberOfItems: vehicleCount,
  };
}

export default async function LamborghiniStockHubPage({
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
      <JsonLd data={faqJsonLd([...LAMBORGHINI_HUB.faqs])} />
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
                ? `${total} Lamborghini${total === 1 ? "" : "s"} in stock`
                : "Sourcing Lamborghinis in Japan"}
            </span>
          </div>
          <h1 className="stock-title">{LAMBORGHINI_HUB.h1}</h1>
          <p className="stock-lead make-hub-intro">{LAMBORGHINI_HUB.intro}</p>
        </header>

        <section className="make-hub-stock" aria-label="Lamborghini stock">
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
              <StockViewItemListTracker vehicles={items} listName="lamborghini_hub" />
              <div className="vehicle-grid stock-grid">
                {items.map((v) => (
                  <VehicleCard key={v.id} v={v} listName="lamborghini_hub" />
                ))}
              </div>
              <StockPagination page={page} totalPages={totalPages} query={paginationQuery} />
            </>
          ) : (
            <div className="stock-empty glass make-hub-empty">
              <h3>No Lamborghinis listed right now</h3>
              <p className="muted">
                We search Japanese dealer stock and auctions for the DB5, V8 Vantage, DB9, V12
                Vantage, Vanquish and more. Tell us what you want.
              </p>
              <div className="stock-source-actions">
                <Link className="btn btn-gold" href="/about#contact-form">
                  Request a Lamborghini
                </Link>
                <WhatsAppLink className="btn btn-outline" location="lamborghini_hub_empty">
                  WhatsApp us
                </WhatsAppLink>
              </div>
            </div>
          )}
        </section>

        <aside className="stock-source-cta glass make-hub-cta">
          <h2 className="heading">{LAMBORGHINI_HUB.closing.title}</h2>
          <p className="muted">{LAMBORGHINI_HUB.closing.body}</p>
          <div className="stock-source-actions">
            <Link className="btn btn-gold" href="/about#contact-form">
              Contact us
            </Link>
            <WhatsAppLink className="btn btn-outline" location="lamborghini_hub_cta">
              WhatsApp us
            </WhatsAppLink>
          </div>
        </aside>

        <article className="make-hub-article">
          {LAMBORGHINI_HUB.lead.slice(1).map((p) => (
            <p key={p.slice(0, 40)} className="make-hub-prose">
              {p}
            </p>
          ))}

          <section className="make-hub-block" aria-labelledby="short-answer">
            <h2 id="short-answer" className="heading">
              {LAMBORGHINI_HUB.shortAnswer.title}
            </h2>
            {LAMBORGHINI_HUB.shortAnswer.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="make-hub-prose">
                {p}
              </p>
            ))}
          </section>

          <section className="make-hub-block" aria-labelledby="comparison">
            <h2 id="comparison" className="heading">
              Ten Lamborghinis worth searching for
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
                  {LAMBORGHINI_HUB.comparison.map((row) => (
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

          {LAMBORGHINI_HUB.models.map((entry) => (
            <section key={entry.id} id={entry.id} className="make-hub-model">
              <div className="make-hub-model-head">
                <h2 className="heading">
                  {entry.name}: {entry.years}
                </h2>
                <Link className="make-hub-model-link" href={lamborghiniStockHref(entry.modelFilter)}>
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
              {LAMBORGHINI_HUB.howToChoose.title}
            </h2>
            {LAMBORGHINI_HUB.howToChoose.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="make-hub-prose">
                {p}
              </p>
            ))}
          </section>
        </article>

        <section className="make-hub-faq" aria-labelledby="lamborghini-faq">
          <h2 id="lamborghini-faq" className="heading">
            Frequently asked questions
          </h2>
          <Faq items={[...LAMBORGHINI_HUB.faqs]} />
        </section>
      </div>
    </main>
  );
}
