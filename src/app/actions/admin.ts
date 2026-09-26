"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Product, Service, SiteSettings } from "@/lib/types";

export type ActionResult = { ok: boolean; message: string };

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  message: "Supabase is not connected yet. Add the two keys in Vercel (or .env.local) and reload.",
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

/** Textareas hold one item per line; empty lines are dropped. */
function lines(v: FormDataEntryValue | null): string[] {
  return String(v ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
}

/** Comma-separated fields, same treatment. */
function commas(v: FormDataEntryValue | null): string[] {
  return String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

/* ---------------------------------------------------------------- auth */

export async function signIn(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!supabaseConfigured) return NOT_CONFIGURED;
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) return { ok: false, message: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: error.message };

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOut() {
  if (supabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

/* ------------------------------------------------------------ products */

export async function saveProduct(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!supabaseConfigured) return NOT_CONFIGURED;

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return { ok: false, message: "Enter a product name." };

  const row: Product = {
    name,
    slug: String(formData.get("slug") ?? "").trim() || slugify(name),
    tagline: String(formData.get("tagline") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim() || null,
    status: (String(formData.get("status") ?? "live") as Product["status"]),
    url: String(formData.get("url") ?? "").trim() || null,
    logo_text: String(formData.get("logo_text") ?? "").trim() || name.slice(0, 2).toUpperCase(),
    color_from: String(formData.get("color_from") ?? "#C60000"),
    color_to: String(formData.get("color_to") ?? "#A30000"),
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    long_description: String(formData.get("long_description") ?? "").trim() || null,
    features: commas(formData.get("features")),
    highlights: lines(formData.get("highlights")),
    price: String(formData.get("price") ?? "").trim() || null,
    old_price: String(formData.get("old_price") ?? "").trim() || null,
    price_note: String(formData.get("price_note") ?? "").trim() || null,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
    sort_order: Number(formData.get("sort_order") ?? 99) || 99,
  };
  const id = String(formData.get("id") ?? "").trim();
  if (id) row.id = id;

  const supabase = await createClient();
  const { error } = await supabase.from("products").upsert(row, { onConflict: "slug" });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/", "layout");
  return { ok: true, message: `Saved “${name}”.` };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  if (!supabaseConfigured) return NOT_CONFIGURED;
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/", "layout");
  return { ok: true, message: "Product deleted." };
}

/* ------------------------------------------------------------ services */

export async function saveService(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!supabaseConfigured) return NOT_CONFIGURED;

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return { ok: false, message: "Enter a service name." };

  const row: Service = {
    name,
    slug: String(formData.get("slug") ?? "").trim() || slugify(name),
    tagline: String(formData.get("tagline") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim() || null,
    icon: String(formData.get("icon") ?? "zap"),
    color_from: String(formData.get("color_from") ?? "#C60000"),
    color_to: String(formData.get("color_to") ?? "#A30000"),
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    long_description: String(formData.get("long_description") ?? "").trim() || null,
    deliverables: lines(formData.get("deliverables")),
    outcomes: lines(formData.get("outcomes")),
    price: String(formData.get("price") ?? "").trim() || null,
    price_note: String(formData.get("price_note") ?? "").trim() || null,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
    sort_order: Number(formData.get("sort_order") ?? 99) || 99,
  };
  const id = String(formData.get("id") ?? "").trim();
  if (id) row.id = id;

  const supabase = await createClient();
  const { error } = await supabase.from("services").upsert(row, { onConflict: "slug" });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/", "layout");
  return { ok: true, message: `Saved “${name}”.` };
}

export async function deleteService(id: string): Promise<ActionResult> {
  if (!supabaseConfigured) return NOT_CONFIGURED;
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/", "layout");
  return { ok: true, message: "Service deleted." };
}

/* --------------------------------------------------------------- leads */

export async function setLeadStatus(id: string, status: string): Promise<ActionResult> {
  if (!supabaseConfigured) return NOT_CONFIGURED;
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/leads");
  return { ok: true, message: "Status updated." };
}

export async function deleteLead(id: string): Promise<ActionResult> {
  if (!supabaseConfigured) return NOT_CONFIGURED;
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/leads");
  return { ok: true, message: "Lead deleted." };
}

/* ------------------------------------------------------------ settings */

export async function saveSettings(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!supabaseConfigured) return NOT_CONFIGURED;

  // The trust band takes three pairs; a blank value drops that column
  // rather than rendering an empty stat.
  const trust = [0, 1, 2]
    .map((i) => ({
      value: String(formData.get(`trust_value_${i}`) ?? "").trim(),
      label: String(formData.get(`trust_label_${i}`) ?? "").trim(),
    }))
    .filter((t) => t.value && t.label);

  const faqQs = formData.getAll("faq_q").map(String);
  const faqAs = formData.getAll("faq_a").map(String);
  const faq = faqQs
    .map((q, i) => ({ q: q.trim(), a: (faqAs[i] ?? "").trim() }))
    .filter((f) => f.q && f.a);

  const data: Partial<SiteSettings> = {
    brand: {
      name: String(formData.get("brand_name") ?? "").trim(),
      tagline: String(formData.get("brand_tagline") ?? "").trim(),
      url: String(formData.get("brand_url") ?? "").trim(),
    },
    contact: {
      phone: String(formData.get("phone") ?? "").trim(),
      phone2: String(formData.get("phone2") ?? "").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").replace(/\D/g, ""),
      email: String(formData.get("email") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      hours: String(formData.get("hours") ?? "").trim(),
    },
    social: {
      facebook: String(formData.get("facebook") ?? "").trim(),
      instagram: String(formData.get("instagram") ?? "").trim(),
      linkedin: String(formData.get("linkedin") ?? "").trim(),
      youtube: String(formData.get("youtube") ?? "").trim(),
      threads: String(formData.get("threads") ?? "").trim(),
    },
    hero: {
      pill: String(formData.get("hero_pill") ?? "").trim(),
      title_lead: String(formData.get("hero_title_lead") ?? "").trim(),
      title_accent: String(formData.get("hero_title_accent") ?? "").trim(),
      title_tail: String(formData.get("hero_title_tail") ?? "").trim(),
      subtitle: String(formData.get("hero_subtitle") ?? "").trim(),
      cta_primary: String(formData.get("hero_cta_primary") ?? "").trim(),
      cta_whatsapp: String(formData.get("hero_cta_whatsapp") ?? "").trim(),
    },
    cta: {
      title: String(formData.get("cta_title") ?? "").trim(),
      subtitle: String(formData.get("cta_subtitle") ?? "").trim(),
    },
    seo: {
      title: String(formData.get("seo_title") ?? "").trim(),
      description: String(formData.get("seo_description") ?? "").trim(),
    },
    tracking: {
      metaPixelId: String(formData.get("meta_pixel_id") ?? "").trim(),
      ga4Id: String(formData.get("ga4_id") ?? "").trim(),
      googleAdsId: String(formData.get("google_ads_id") ?? "").trim(),
    },
    audiences: lines(formData.get("audiences")),
    ...(trust.length ? { trust } : {}),
    ...(faq.length ? { faq } : {}),
  };

  const supabase = await createClient();
  const { error } = await supabase.from("settings").upsert({ id: 1, data });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved. The site is already showing them." };
}
