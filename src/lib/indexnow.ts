import { SITE } from "@/lib/site";
import { vehicleStockPath } from "@/lib/slug";
import { isPublicVehicleStatus } from "@/lib/vehicle-constants";
import { getAllVehicleSlugs, searchVehicles } from "@/lib/vehicles";
import { STOCK_PAGE_SIZE } from "@/lib/stock";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** IndexNow key: 8–128 chars, alphanumeric and hyphen. */
export function getIndexNowKey(): string | undefined {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key || key.length < 8 || key.length > 128) return undefined;
  if (!/^[a-zA-Z0-9-]+$/.test(key)) return undefined;
  return key;
}

export function indexNowKeyFileName(): string | null {
  const key = getIndexNowKey();
  return key ? `${key}.txt` : null;
}

/**
 * Key file at site root (IndexNow option 1).
 * A key under /indexnow/ only authorizes URLs under /indexnow/ — that caused 422s.
 */
export function indexNowKeyLocation(): string | null {
  const key = getIndexNowKey();
  if (!key) return null;
  const base = SITE.url.replace(/\/$/, "");
  return `${base}/${key}.txt`;
}

function indexNowHost(): string | null {
  try {
    return new URL(SITE.url).hostname;
  } catch {
    return null;
  }
}

export function vehicleIndexNowUrl(slug: string): string {
  return `${SITE.url}${vehicleStockPath(slug)}`;
}

export type IndexNowSubmitResult = {
  configured: boolean;
  ok: boolean;
  status: number;
  submitted: number;
  detail?: string;
};

export async function submitIndexNowUrls(urls: string[]): Promise<IndexNowSubmitResult> {
  const key = getIndexNowKey();
  const host = indexNowHost();
  const keyLocation = indexNowKeyLocation();
  if (!key || !host || !keyLocation) {
    return { configured: false, ok: false, status: 0, submitted: 0 };
  }

  const base = SITE.url.replace(/\/$/, "");
  const unique = [
    ...new Set(
      urls
        .map((u) => u.trim())
        .filter((u) => {
          try {
            return new URL(u).hostname === host;
          } catch {
            return false;
          }
        }),
    ),
  ];
  if (unique.length === 0) {
    return { configured: true, ok: true, status: 200, submitted: 0 };
  }

  // Prefer root URLs without trailing slash except for homepage.
  const urlList = unique
    .map((u) => (u === `${base}/` ? u : u.replace(/\/$/, "")))
    .slice(0, 10_000);

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  });

  const detail = res.ok ? undefined : (await res.text().catch(() => "")).slice(0, 300);

  return {
    configured: true,
    ok: res.ok || res.status === 202,
    status: res.status,
    submitted: urlList.length,
    detail: detail || undefined,
  };
}

/** Fire-and-forget URL notification (listing updates, deploy). */
export function scheduleIndexNowUrls(urls: string[]): void {
  void submitIndexNowUrls(urls)
    .then((r) => {
      if (!r.configured) return;
      if (!r.ok) {
        console.warn("[indexnow] API responded", r.status, "urls=", r.submitted);
      }
    })
    .catch((err) => {
      console.warn("[indexnow] submit failed", err);
    });
}

export function scheduleIndexNowForVehicle(v: { slug: string; status: string }): void {
  if (!getIndexNowKey()) return;
  if (!isPublicVehicleStatus(v.status)) return;
  scheduleIndexNowUrls([vehicleIndexNowUrl(v.slug)]);
}

/** Same URL set as sitemap.xml (no image URLs). */
export async function collectIndexNowSitemapUrls(): Promise<string[]> {
  const [vehicles, stock] = await Promise.all([
    getAllVehicleSlugs(),
    searchVehicles({}, 1, 1),
  ]);

  const stockPageCount = Math.max(1, Math.ceil(stock.total / STOCK_PAGE_SIZE));
  const urls: string[] = [`${SITE.url}/`];

  for (let page = 1; page <= stockPageCount; page++) {
    urls.push(
      page === 1 ? `${SITE.url}/stock` : `${SITE.url}/stock?page=${page}`,
    );
  }

  urls.push(
    `${SITE.url}/stock/ferrari`,
    `${SITE.url}/stock/aston-martin`,
    `${SITE.url}/stock/bentley`,
    `${SITE.url}/stock/lamborghini`,
    `${SITE.url}/stock/mclaren`,
    `${SITE.url}/about`,
  );

  for (const v of vehicles) {
    urls.push(`${SITE.url}${vehicleStockPath(v.slug)}`);
  }

  return [...new Set(urls)];
}

export async function submitIndexNowSitemap(): Promise<IndexNowSubmitResult> {
  const urls = await collectIndexNowSitemapUrls();
  return submitIndexNowUrls(urls);
}
