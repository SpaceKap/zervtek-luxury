import type { MetadataRoute } from "next";
import { getAllVehicleSlugs, searchVehicles } from "@/lib/vehicles";
import { SITE } from "@/lib/site";
import { vehicleStockPath } from "@/lib/slug";
import { STOCK_PAGE_SIZE } from "@/lib/stock";

export const dynamic = "force-dynamic";

/** Cap per listing — Google allows 1000; keep sitemap lean. */
const MAX_IMAGES_PER_VEHICLE = 20;

function absImageUrl(src: string): string {
  return src.startsWith("http") ? src : `${SITE.url}${src}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, stock] = await Promise.all([
    getAllVehicleSlugs(),
    searchVehicles({}, 1, 1),
  ]);

  const stockPageCount = Math.max(1, Math.ceil(stock.total / STOCK_PAGE_SIZE));
  const stockPages: MetadataRoute.Sitemap = Array.from({ length: stockPageCount }, (_, i) => {
    const page = i + 1;
    return {
      url: page === 1 ? `${SITE.url}/stock` : `${SITE.url}/stock?page=${page}`,
      changeFrequency: "hourly" as const,
      priority: page === 1 ? 0.9 : 0.7,
    };
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "daily", priority: 1 },
    ...stockPages,
    { url: `${SITE.url}/stock/ferrari`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE.url}/stock/aston-martin`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE.url}/about`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: `${SITE.url}${vehicleStockPath(v.slug)}`,
    lastModified: v.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: v.images.slice(0, MAX_IMAGES_PER_VEHICLE).map(absImageUrl),
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
