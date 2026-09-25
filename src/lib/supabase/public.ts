import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON, SUPABASE_URL } from "@/lib/supabase/server";

/**
 * A client for data every visitor is allowed to see.
 *
 * It deliberately reads no cookies. The cookie-based client in server.ts calls
 * next/headers `cookies()`, and touching a request-time API opts the whole
 * route out of prerendering — which is why every public page was being
 * server-rendered per request, with `Cache-Control: no-store` and no CDN hit.
 * A marketing site paying for ad traffic cannot afford that on every visit.
 *
 * Only use this where RLS already restricts the rows to what is public:
 * published products and services, and the settings row. Anything that needs
 * the signed-in admin still goes through createClient().
 */
export function createPublicClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
