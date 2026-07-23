import type { MetadataRoute } from "next";
import { SEO_SERVICES, SEO_CITIES } from "@/data/seo";

const BASE_URL = "https://minuteglass.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/deposer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/tarifs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const seoRoutes: MetadataRoute.Sitemap = [];
  for (const service of Object.values(SEO_SERVICES)) {
    for (const city of SEO_CITIES) {
      seoRoutes.push({
        url: `${BASE_URL}/${service.slug}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return [...staticRoutes, ...seoRoutes];
}
