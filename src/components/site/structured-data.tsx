import type { SiteSettings } from "@/lib/types";
import { siteUrl } from "@/lib/site-url";

/**
 * JSON-LD, so a search engine reads the business as a business rather than as
 * a page of words: who it is, how to reach it, and what it answers.
 *
 * Everything here is pulled from settings, so it can never drift from what the
 * page actually says — and nothing is invented. No aggregateRating and no
 * review markup: there are no real reviews yet, and fabricated ones are both a
 * Google structured-data violation and a Meta Ads policy violation.
 */
function Ld({ id, data }: { id: string; data: object }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // The string is generated from our own data, and < is escaped so it can
      // never close the script tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\u003c"),
      }}
    />
  );
}

export function OrganizationLd({ settings }: { settings: SiteSettings }) {
  const base = siteUrl(settings.brand.url);
  const { brand, contact, social } = settings;

  const phones = [contact.phone, contact.phone2]
    .map((p) => (p ?? "").trim())
    .filter(Boolean);

  const sameAs = [social.facebook, social.instagram, social.linkedin, social.youtube, social.threads]
    .map((u) => (u ?? "").trim())
    .filter(Boolean);

  return (
    <Ld
      id="ld-organization"
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: brand.name,
        url: base,
        logo: `${base}/brand/logo-wide.png`,
        image: `${base}/og-cover.png`,
        description: brand.tagline,
        ...(contact.email ? { email: contact.email } : {}),
        ...(phones.length ? { telephone: phones[0] } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        ...(contact.address ? { address: { "@type": "PostalAddress", addressCountry: contact.address } } : {}),
        ...(phones.length
          ? {
              contactPoint: phones.map((telephone) => ({
                "@type": "ContactPoint",
                telephone,
                contactType: "sales",
                areaServed: "IN",
                availableLanguage: ["en", "hi"],
              })),
            }
          : {}),
      }}
    />
  );
}

/** Lets Google show the breadcrumb trail in search results instead of a bare URL. */
export function BreadcrumbLd({
  items, base,
}: { items: { name: string; path: string }[]; base: string }) {
  return (
    <Ld
      id="ld-breadcrumb"
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${base}${it.path}`,
        })),
      }}
    />
  );
}

/**
 * schema.org/Product for a product page. `offers` is included only when a
 * real numeric price exists — "Pricing on request" is not a price, and an
 * invented one would be a structured-data policy violation.
 */
export function ProductLd({
  product, base,
}: {
  product: { name: string; slug: string; description?: string | null; image_url?: string | null; price?: string | null };
  base: string;
}) {
  const numericPrice = product.price?.match(/[\d,]+(\.\d+)?/)?.[0]?.replace(/,/g, "");
  return (
    <Ld
      id="ld-product"
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description ?? undefined,
        url: `${base}/products/${product.slug}`,
        ...(product.image_url ? { image: product.image_url } : {}),
        brand: { "@type": "Brand", name: "Essor Automations" },
        ...(numericPrice
          ? {
              offers: {
                "@type": "Offer",
                price: numericPrice,
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                url: `${base}/products/${product.slug}`,
              },
            }
          : {}),
      }}
    />
  );
}

/** schema.org/Service for a service page — tied back to the Organization as provider. */
export function ServiceLd({
  service, base,
}: {
  service: { name: string; slug: string; description?: string | null; category?: string | null };
  base: string;
}) {
  return (
    <Ld
      id="ld-service"
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.name,
        description: service.description ?? undefined,
        url: `${base}/services/${service.slug}`,
        serviceType: service.category ?? undefined,
        areaServed: "IN",
        provider: { "@type": "Organization", name: "Essor Automations", url: base },
      }}
    />
  );
}

/** schema.org/BlogPosting — lets Google show the article card in search results. */
export function BlogPostingLd({
  post, base,
}: {
  post: { slug: string; title: string; excerpt?: string | null; cover_image_url?: string | null; created_at?: string; updated_at?: string };
  base: string;
}) {
  return (
    <Ld
      id="ld-blogposting"
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt ?? undefined,
        url: `${base}/blog/${post.slug}`,
        ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
        datePublished: post.created_at ?? post.updated_at ?? undefined,
        dateModified: post.updated_at ?? post.created_at ?? undefined,
        author: { "@type": "Organization", name: "Essor Automations" },
        publisher: { "@type": "Organization", name: "Essor Automations", url: base },
      }}
    />
  );
}

export function FaqLd({ faq }: { faq: SiteSettings["faq"] }) {
  if (!faq.length) return null;
  return (
    <Ld
      id="ld-faq"
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}
