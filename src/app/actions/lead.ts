"use server";

import { supabaseConfigured } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

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

  // Indian mobile: 10 digits starting 6-9, with an optional +91/91/0 prefix.
  // Stored as the bare 10-digit number so the admin's wa.me link always works.
  const phoneDigits = phone.replace(/[\s-]/g, "");
  const phoneMatch = phoneDigits.match(/^(?:\+?91|0)?([6-9]\d{9})$/);
  if (!phoneMatch) {
    return {
      ok: false, stored: false,
      message: "Please enter a valid 10-digit Indian mobile number (e.g. 98XXXXXXXX).",
    };
  }
  const normalizedPhone = phoneMatch[1];

  if (!email || !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) {
    return { ok: false, message: "Please enter a valid email address.", stored: false };
  }

  if (!supabaseConfigured) {
    // No database yet: tell the truth rather than pretending it was saved.
    return {
      ok: true, stored: false,
      message: "Thanks! Please send us the same details on WhatsApp so we can reply — our enquiry inbox is not connected yet.",
    };
  }

  try {
    const supabase = createPublicClient();
    const { error } = await supabase.from("leads").insert({
      name, phone: normalizedPhone, email, product: product || null,
      message: message || null, source: "website", status: "new",
    });
    if (error) throw new Error(error.message);
    return { ok: true, stored: true, message: "Thank you! We have your enquiry and will contact you within 24 hours." };
  } catch (err) {
    // Logged so the real cause (RLS, network, bad column, etc.) shows up in
    // Vercel's function logs instead of only the generic message the visitor sees.
    console.error("submitLead failed:", err);
    return {
      ok: false, stored: false,
      message: "Something went wrong saving that. Please message us on WhatsApp instead.",
    };
  }
}
