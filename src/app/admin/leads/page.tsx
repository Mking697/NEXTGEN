import { PageHead } from "@/components/admin/page-head";
import { SetupBanner } from "@/components/admin/setup-banner";
import { LeadsTable } from "@/components/admin/leads-table";
import { getLeads } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase/server";

export default async function AdminLeads() {
  const leads = await getLeads();

  return (
    <>
      <PageHead title="Leads" sub="Enquiries submitted through the website forms." />
      {!supabaseConfigured && <SetupBanner />}
      <LeadsTable leads={leads} />
    </>
  );
}
