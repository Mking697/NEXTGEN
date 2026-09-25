import { AlertTriangle } from "lucide-react";

/** Shown until Supabase is connected. The admin renders either way, but
 *  nothing it saves can persist, so say that plainly rather than letting
 *  someone type for ten minutes and lose it. */
export function SetupBanner() {
  return (
    <div className="mb-6 flex gap-3 rounded-2xl border border-warn-line bg-warn-tint p-4 text-[0.9rem]">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warn" />
      <div>
        <strong className="font-bold">Supabase is not connected yet, so nothing here can be saved.</strong>
        <p className="mt-1 text-muted-foreground">
          The website is running on its built-in seed content. To switch it on: create a project at
          supabase.com, run <code className="rounded bg-card px-1.5 py-0.5">supabase-schema.sql</code> in
          its SQL editor, then add <code className="rounded bg-card px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-card px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in Vercel
          (or <code className="rounded bg-card px-1.5 py-0.5">.env.local</code> for local work).
        </p>
      </div>
    </div>
  );
}
