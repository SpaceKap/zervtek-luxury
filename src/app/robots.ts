import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/media/vehicles/"],
        disallow: ["/admin", "/api", "/api/internal", "/uploads", "/blog", "/mock"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
