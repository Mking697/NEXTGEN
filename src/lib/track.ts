/**
 * Fired when the enquiry form actually succeeds — not when it is submitted.
 * A submit that failed validation or never reached the database is not a lead,
 * and counting it would teach Meta's algorithm to chase the wrong people.
 *
 * Both calls are optional: if no pixel is configured, window.fbq is undefined
 * and nothing happens.
 */
export function trackLead(label?: string) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Lead", label ? { content_name: label } : {});
  window.gtag?.("event", "generate_lead", label ? { item_name: label } : {});
}

/**
 * Fired when a visitor clicks a tel: link. This is the primary conversion
 * signal for this business (phone calls are the #1 sales channel), so it
 * must fire on every tel: click site-wide, not just on one page's buttons.
 */
export function trackCall() {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Contact", { content_name: "Phone call click" });
  window.gtag?.("event", "click_to_call");
}

/** Fired when a visitor clicks a wa.me WhatsApp link, anywhere on the site. */
export function trackWhatsApp() {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Contact", { content_name: "WhatsApp click" });
  window.gtag?.("event", "whatsapp_click");
}
