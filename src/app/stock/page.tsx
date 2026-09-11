import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getStockFilterMeta, searchVehicles } from "@/lib/vehicles";
import {
  StockBrowseView,
  stockBrowseCopy,
  stockBrowseCrumbs,
} from "@/components/StockBrowseView";
import {
  STOCK_PAGE_SIZE,
  buildStockHref,
  filtersFromStockSp,
  firstStockParam,
  parseStockPage,
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
  const page = parseStockPage(firstStockParam(sp.page));
  if (page === null) {
    return { title: "Stock not found", robots: { index: false, follow: false } };
  }

  // Query make/model redirect to path URLs — metadata here is for clean /stock only.
  if (firstStockParam(sp.make) || firstStockParam(sp.model)) {
    return { title: "Performance Car Stock | Browse & Search" };
  }

  const qs = stockQueryFromSp(sp);
  const noindex = stockShouldNoIndex(qs);
  const canonical = stockCanonicalPath(page, { hasExtraFilters: noindex });
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
  const pageRaw = firstStockParam(sp.page);
  const page = parseStockPage(pageRaw);
  if (page === null) notFound();

  const qs = stockQueryFromSp(sp);

  // Canonicalize make/model query → /stock/{make}/{model}
  if (qs.make || qs.model) {
    permanentRedirect(
      buildStockHref({
        ...qs,
        page: page > 1 ? String(page) : undefined,
      }),
    );
  }

  // Normalize ?page=1 to clean /stock (preserve other params).
  if (pageRaw === "1") {
    permanentRedirect(buildStockHref({ ...qs, page: undefined }));
  }

  const filters = filtersFromStockSp(sp);
  const [{ items, total }, { catalog }] = await Promise.all([
    searchVehicles(filters, page, STOCK_PAGE_SIZE),
    getStockFilterMeta(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / STOCK_PAGE_SIZE));
  if (page > totalPages) notFound();

  const copy = stockBrowseCopy();
  const { crumbs, jsonLdCrumbs } = stockBrowseCrumbs();

  return (
    <StockBrowseView
      items={items}
      total={total}
      page={page}
      totalPages={totalPages}
      catalog={catalog}
      filters={filters}
      title={copy.title}
      lead={copy.lead}
      crumbs={crumbs}
      jsonLdCrumbs={jsonLdCrumbs}
    />
  );
}
