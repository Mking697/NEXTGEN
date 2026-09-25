"use server";

import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export type LeadResult = { ok: boolean; message: string; stored: boolean };

export async function submitLead(_prev: LeadResult | null, formData: FormData): Promise<LeadResult> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const product = String(formData.get("product") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honey = String(formData.get("company") ?? "");

  // Honeypot: a bot fills every field, a person never sees this one.
  if (honey) return { ok: true, message: "Thank you.", stored: false };

  if (name.length < 2) return { ok: false, message: "Please enter your name.", stored: false };
  if (!/^[+\d][\d\s-]{7,17}$/.test(phone)) {
    return { ok: false, message: "Please enter a valid phone number (10 digits).", stored: false };
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) {
    return { ok: false, message: "That email address does not look right.", stored: false };
  }

  if (!supabaseConfigured) {
    // No database yet: tell the truth rather than pretending it was saved.
    return {
      ok: true, stored: false,
      message: "Thanks! Please send us the same details on WhatsApp so we can reply — our enquiry inbox is not connected yet.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("leads").insert({
      name, phone, email: email || null, product: product || null,
      message: message || null, source: "website", status: "new",
    });
    if (error) throw new Error(error.message);
    return { ok: true, stored: true, message: "Thank you! We have your enquiry and will contact you within 24 hours." };
  } catch {
    return {
      ok: false, stored: false,
      message: "Something went wrong saving that. Please message us on WhatsApp instead.",
    };
  }
}
