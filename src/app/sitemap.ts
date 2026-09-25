import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { getProducts, getServices, getSettings } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, products, services] = await Promise.all([
    getSettings(), getProducts(), getServices(),
  ]);
  const base = siteUrl(settings.brand.url);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticPages,
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`, lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "monthly" as const, priority: 0.8,
    })),
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`, lastModified: s.updated_at ? new Date(s.updated_at) : now,
      changeFrequency: "monthly" as const, priority: 0.7,
    })),
  ];
}
