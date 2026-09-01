import type { MetadataRoute } from "next";
import { listPublishedBlogPosts } from "@/lib/blog";
import { getAllVehicleSlugs } from "@/lib/vehicles";
import { SITE } from "@/lib/site";
import { vehicleStockPath } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, posts] = await Promise.all([
    getAllVehicleSlugs(),
    listPublishedBlogPosts(200),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/stock`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/about`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: `${SITE.url}${vehicleStockPath(v.slug)}`,
    lastModified: v.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticRoutes, ...vehicleRoutes, ...blogRoutes];
}
