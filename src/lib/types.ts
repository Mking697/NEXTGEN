export type Status = "live" | "beta" | "soon";

export interface Product {
  id?: string;
  slug: string;
  name: string;
  tagline?: string | null;
  category?: string | null;
  status?: Status | null;
  url?: string | null;
  logo_text?: string | null;
  color_from?: string | null;
  color_to?: string | null;
  image_url?: string | null;
  description?: string | null;
  long_description?: string | null;
  features?: string[] | null;
  highlights?: string[] | null;
  price?: string | null;
  old_price?: string | null;
  price_note?: string | null;
  published?: boolean | null;
  featured?: boolean | null;
  sort_order?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id?: string;
  slug: string;
  name: string;
  tagline?: string | null;
  category?: string | null;
  icon?: string | null;
  color_from?: string | null;
  color_to?: string | null;
  image_url?: string | null;
  description?: string | null;
  long_description?: string | null;
  deliverables?: string[] | null;
  outcomes?: string[] | null;
  price?: string | null;
  price_note?: string | null;
  published?: boolean | null;
  featured?: boolean | null;
  sort_order?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface Lead {
  id?: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  product?: string | null;
  message?: string | null;
  source?: string | null;
  status?: "new" | "contacted" | "qualified" | "won" | "lost" | null;
  created_at?: string;
}

export interface TrustStat {
  value: string;
  label: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

/** Everything the admin can change about the site's copy and contact details. */
export interface SiteSettings {
  brand: {
    name: string;
    tagline: string;
    url: string;
  };
  contact: {
    phone: string;
    phone2?: string;
    /** digits only, with country code, no + or spaces */
    whatsapp: string;
    email: string;
    address: string;
    hours: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    threads?: string;
  };
  hero: {
    pill: string;
    title_lead: string;
    title_accent: string;
    title_tail: string;
    subtitle: string;
    cta_primary: string;
    cta_whatsapp: string;
  };
  trust: TrustStat[];
  audiences: string[];
  cta: {
    title: string;
    subtitle: string;
  };
  faq: FaqItem[];
  seo: {
    title: string;
    description: string;
  };
  tracking: {
    metaPixelId?: string;
    ga4Id?: string;
    googleAdsId?: string;
  };
}
