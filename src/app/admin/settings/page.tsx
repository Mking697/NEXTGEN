import { PageHead } from "@/components/admin/page-head";
import { SetupBanner } from "@/components/admin/setup-banner";
import { SettingsEditor } from "@/components/admin/settings-editor";
import { getSettings } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase/server";

export default async function AdminSettings() {
  const settings = await getSettings();

  return (
    <>
      <PageHead title="Settings" sub="Contact details, homepage copy, the trust band, FAQ and SEO." />
      {!supabaseConfigured && <SetupBanner />}
      <div className="max-w-[860px]">
        <SettingsEditor settings={settings} />
      </div>
    </>
  );
}
