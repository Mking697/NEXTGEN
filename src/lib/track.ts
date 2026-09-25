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
