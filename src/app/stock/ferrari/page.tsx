import type { Metadata } from "next";
import Link from "next/link";
import { searchVehicles } from "@/lib/vehicles";
import { VehicleCard } from "@/components/VehicleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Faq } from "@/components/Faq";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { breadcrumbJsonLd, productListJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { FERRARI_HUB, ferrariStockHref } from "@/lib/make-hubs/ferrari";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: FERRARI_HUB.title,
  description: FERRARI_HUB.description,
  alternates: { canonical: "/stock/ferrari" },
  openGraph: {
    title: FERRARI_HUB.title,
    description: FERRARI_HUB.description,
    url: `${SITE.url}/stock/ferrari`,
    type: "website",
  },
};

function collectionJsonLd(vehicleCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: FERRARI_HUB.h1,
    description: FERRARI_HUB.description,
    url: `${SITE.url}/stock/ferrari`,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    about: {
      "@type": "Brand",
      name: "Ferrari",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Ferrari models covered",
      numberOfItems: FERRARI_HUB.models.length,
      itemListElement: FERRARI_HUB.models.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: m.name,
        url: `${SITE.url}/stock/ferrari#${m.id}`,
      })),
    },
    numberOfItems: vehicleCount,
  };
}

export default async function FerrariStockHubPage() {
  const { items, total } = await searchVehicles({ make: "Ferrari", sort: "newest" }, 1, 24);

  return (
    <main className="make-hub-page stock-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE.url },
          { name: "Stock", url: `${SITE.url}/stock` },
          { name: "Ferrari", url: `${SITE.url}/stock/ferrari` },
        ])}
      />
      <JsonLd data={collectionJsonLd(total)} />
      {items.length > 0 ? <JsonLd data={productListJsonLd(items)} /> : null}

      <header className="stock-hero container">
        <div className="stock-meta">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Stock", href: "/stock" },
              { label: "Ferrari" },
            ]}
          />
          <span>
            {total > 0 ? `${total} Ferrari${total === 1 ? "" : "s"} in stock` : "Sourcing Ferraris in Japan"}
          </span>
        </div>
        <h1 className="stock-title">{FERRARI_HUB.h1}</h1>
        <p className="stock-lead">{FERRARI_HUB.lead[0]}</p>
      </header>

      <div className="make-hub-body container">
        <section className="make-hub-stock" aria-labelledby="ferrari-stock-heading">
          <div className="make-hub-section-head">
            <h2 id="ferrari-stock-heading" className="heading">
              Ferrari stock from Japan
            </h2>
            <p className="muted">
              Live listings below. Prefer a specific model? Jump to the guides, or ask us to source one.
            </p>
          </div>

          {items.length > 0 ? (
            <div className="vehicle-grid stock-grid">
              {items.map((v) => (
                <VehicleCard key={v.id} v={v} />
              ))}
            </div>
          ) : (
            <div className="stock-empty glass make-hub-empty">
              <h3>No Ferraris listed right now</h3>
              <p className="muted">
                We search Japanese dealer stock and auctions for the 308, F355, 360, 458, Testarossa, F12 and
                more. Tell us what you want.
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

          {items.length > 0 ? (
            <p className="make-hub-stock-more">
              <Link href={ferrariStockHref()}>View all Ferrari filters on stock →</Link>
            </p>
          ) : null}
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

          {FERRARI_HUB.models.map((model) => (
            <section key={model.id} id={model.id} className="make-hub-model">
              <div className="make-hub-model-head">
                <h2 className="heading">
                  {model.name}: {model.years}
                </h2>
                <Link className="make-hub-model-link" href={ferrariStockHref(model.modelFilter)}>
                  Search stock
                </Link>
              </div>
              {model.paragraphs.map((p) => (
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
        </article>
      </div>
    </main>
  );
}
