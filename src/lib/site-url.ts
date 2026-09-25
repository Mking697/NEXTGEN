/**
 * The canonical origin used for metadata, robots.txt and the sitemap.
 *
 * NEXT_PUBLIC_SITE_URL is read first, but a variable that exists and is blank
 * counts as absent. Vercel's importer pre-fills every name it finds in
 * .env.example, so an empty string is the likely state of an unfilled variable
 * rather than undefined — and `?? fallback` does not catch an empty string.
 * That is what broke the first production build.
 *
 * A value missing its scheme is given https://, and anything still unparseable
 * falls through to the next candidate instead of throwing: a slightly wrong
 * canonical URL is a bad deploy, but a thrown one is no deploy at all.
 */
const FALLBACK = "https://essorautomations.in";

export function siteUrl(brandUrl?: string): string {
  for (const candidate of [process.env.NEXT_PUBLIC_SITE_URL, brandUrl, FALLBACK]) {
    const raw = candidate?.trim();
    if (!raw) continue;
    try {
      return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).origin;
    } catch {
      continue;
    }
  }
  return FALLBACK;
}
