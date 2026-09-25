import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { SetupBanner } from "@/components/admin/setup-banner";
import { supabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-secondary p-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 flex justify-center">
          <Image src="/brand/logo-wide.png" alt="Essor Automations" width={420} height={140} className="h-10 w-auto" />
        </div>
        {!supabaseConfigured && <SetupBanner />}
        <Suspense>
          <LoginForm disabled={!supabaseConfigured} />
        </Suspense>
        <p className="mt-5 text-center text-[0.8rem] text-muted-foreground">
          This page is hidden from search engines.
        </p>
      </div>
    </div>
  );
}
