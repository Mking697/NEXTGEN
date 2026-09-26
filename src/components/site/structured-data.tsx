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
