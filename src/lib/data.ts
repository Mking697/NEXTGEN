import "server-only";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { defaultProducts, defaultServices, defaultSettings } from "@/lib/defaults";
import type { Lead, Product, Service, SiteSettings } from "@/lib/types";

/**
 * Read layer for the public site.
 *
 * Every function falls back to the seed content in defaults.ts when Supabase
 * is not configured, or when a query fails. That is deliberate: a marketing
 * site that 500s because a database is down is worse than one showing
 * slightly stale copy, and it lets the whole site run before Supabase exists.
 *
 * Reads split by audience, not by convenience: anything a visitor may see goes
 * through the cookie-free public client so the page stays prerenderable, and
 * only `includeHidden` reads and the lead list use the cookie-based client,
 * which needs the admin's session and makes the route dynamic.
 */

const readClient = async (includeHidden?: boolean) =>
  includeHidden ? await createClient() : createPublicClient();

function sortItems<T extends { sort_order?: number | null; name: string }>(rows: T[]) {
  return [...rows].sort(
    (a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99) || a.name.localeCompare(b.name),
  );
}

export async function getProducts(opts?: { includeHidden?: boolean }): Promise<Product[]> {
  const seed = sortItems(
    opts?.includeHidden ? defaultProducts : defaultProducts.filter((p) => p.published !== false),
  );
  if (!supabaseConfigured) return seed;

  try {
    const supabase = await readClient(opts?.includeHidden);
    let q = supabase.from("products").select("*").order("sort_order", { ascending: true });
    if (!opts?.includeHidden) q = q.eq("published", true);
    const { data, error } = await q;
    if (error || !data) return seed;
    return data.length ? (data as Product[]) : seed;
  } catch {
    return seed;
  }
}

export async function getProduct(
  slug: string, opts?: { includeHidden?: boolean },
): Promise<Product | null> {
  const all = await getProducts(opts);
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getServices(opts?: { includeHidden?: boolean }): Promise<Service[]> {
  const seed = sortItems(
    opts?.includeHidden ? defaultServices : defaultServices.filter((s) => s.published !== false),
  );
  if (!supabaseConfigured) return seed;

  try {
    const supabase = await readClient(opts?.includeHidden);
    let q = supabase.from("services").select("*").order("sort_order", { ascending: true });
    if (!opts?.includeHidden) q = q.eq("published", true);
    const { data, error } = await q;
    if (error || !data) return seed;
    return data.length ? (data as Service[]) : seed;
  } catch {
    return seed;
  }
}

export async function getService(
  slug: string, opts?: { includeHidden?: boolean },
): Promise<Service | null> {
  const all = await getServices(opts);
  return all.find((x) => x.slug === slug) ?? null;
}

/** Stored as a single JSON row so the admin can edit copy without migrations. */
export async function getSettings(): Promise<SiteSettings> {
  if (!supabaseConfigured) return defaultSettings;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("settings").select("data").eq("id", 1).maybeSingle();
    if (error || !data?.data) return defaultSettings;
    // Shallow-merge so a partially filled row cannot blank the site.
    const saved = data.data as Partial<SiteSettings>;
    return {
      ...defaultSettings,
      ...saved,
      brand: { ...defaultSettings.brand, ...saved.brand },
      contact: { ...defaultSettings.contact, ...saved.contact },
      social: { ...defaultSettings.social, ...saved.social },
      hero: { ...defaultSettings.hero, ...saved.hero },
      cta: { ...defaultSettings.cta, ...saved.cta },
      seo: { ...defaultSettings.seo, ...saved.seo },
      tracking: { ...defaultSettings.tracking, ...saved.tracking },
      trust: saved.trust?.length ? saved.trust : defaultSettings.trust,
      audiences: saved.audiences?.length ? saved.audiences : defaultSettings.audiences,
      faq: saved.faq?.length ? saved.faq : defaultSettings.faq,
    };
  } catch {
    return defaultSettings;
  }
}

export async function getLeads(): Promise<Lead[]> {
  if (!supabaseConfigured) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leads").select("*").order("created_at", { ascending: false }).limit(500);
    if (error || !data) return [];
    return data as Lead[];
  } catch {
    return [];
  }
}

/** Build a wa.me link with a prefilled message. */
export function waLink(whatsapp: string, text: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
}
