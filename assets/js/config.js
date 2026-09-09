/* ============================================================
   NEXT GEN AUTOMATION — Site Configuration
   ------------------------------------------------------------
   This is the only file you normally need to edit.
   ============================================================ */

window.NGA_CONFIG = {

  /* ---------- 1. BRAND ---------- */
  brand: {
    name: "NextGen Business Automation",
    short: "NextGen",
    tagline: "Business Automation, Built & Delivered",
    domain: "nextgenauto.online",
    url: "https://nextgenauto.online"        // https, no trailing slash
  },

  /* ---------- 2. CONTACT ---------- */
  contact: {
    phone: "+91 93114 32603",                // primary, shown everywhere
    phone2: "+91 90272 02796",               // secondary, shown in footer/contact
    whatsapp: "919311432603",                // digits only, with country code, no + or spaces
    email: "manojtiwari8428@gmail.com",
    address: "India",
    hours: "Mon – Sat, 10:00 AM – 7:00 PM IST"
  },

  /* ---------- 3. SOCIAL (leave empty to hide the icon) ---------- */
  social: {
    facebook:  "",
    instagram: "",
    linkedin:  "",
    youtube:   "",
    twitter:   ""
  },

  /* ---------- 4. SUPABASE (makes the admin panel live) ----------
     Setup: supabase.com -> New project -> SQL Editor -> paste and run
     supabase-schema.sql -> Settings > API -> paste URL + anon key here.
     Left empty, the site reads data/*.json instead (read-only mode).
  ------------------------------------------------------------------- */
  supabase: {
    url: "",        // e.g. https://abcdefgh.supabase.co
    anonKey: ""     // public anon key — safe to ship, RLS protects the data
  },

  /* ---------- 5. TRACKING (needed for Meta Ads) ---------- */
  tracking: {
    metaPixelId: "",        // e.g. "1234567890123456"
    googleAdsId: "",        // e.g. "AW-123456789"
    ga4Id: ""               // e.g. "G-XXXXXXXXXX"
  },

  /* ---------- 6. LEAD FALLBACK ----------
     Where form submissions go when Supabase is not configured:
     "whatsapp" = opens WhatsApp with the enquiry prefilled
     "mailto"   = opens the visitor's email client
     "formspree"= posts to a formspree.io endpoint (set the URL below)
  --------------------------------------- */
  leadFallback: {
    mode: "whatsapp",
    formspreeUrl: ""       // e.g. https://formspree.io/f/xxxxxxx
  },

  /* ---------- 7. ADMIN ---------- */
  admin: {
    // Ignored once Supabase is configured — a real login is used instead.
    // This is only for local preview. Change it, and rely on hPanel
    // Directory Privacy for real protection.
    demoPasscode: "nga@2026"
  }
};
