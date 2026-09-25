import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/data";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? settings.brand.url).replace(/\/$/, "");

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
