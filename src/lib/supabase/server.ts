import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Whether Supabase is wired up. Everything degrades to seed data if not. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON);

/**
 * Request-scoped client. Reads the auth cookies so RLS sees the signed-in
 * admin; in a Server Component the cookie write is a no-op, which is expected
 * and why the setAll failure is swallowed.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — middleware refreshes the session.
        }
      },
    },
  });
}
