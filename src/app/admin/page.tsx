import Link from "next/link";
import { Package, Briefcase, Inbox, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/admin/page-head";
import { SetupBanner } from "@/components/admin/setup-banner";
import { getLeads, getProducts, getServices } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const [products, services, leads] = await Promise.all([
    getProducts({ includeHidden: true }),
    getServices({ includeHidden: true }),
    getLeads(),
  ]);
  const live = products.filter((p) => p.status === "live").length;
  const newLeads = leads.filter((l) => !l.status || l.status === "new").length;

  const tiles = [
    { label: "New leads", value: newLeads, Icon: Inbox, href: "/admin/leads", accent: true },
    { label: "Products", value: products.length, Icon: Package, href: "/admin/products" },
    { label: "Live in production", value: live, Icon: CheckCircle2, href: "/admin/products" },
    { label: "Services", value: services.length, Icon: Briefcase, href: "/admin/services" },
  ];

  return (
    <>
      <PageHead title="Dashboard" sub="Everything the website shows, in one place." />
      {!supabaseConfigured && <SetupBanner />}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ label, value, Icon, href, accent }) => (
          <Link
            key={label} href={href}
            className="rounded-2xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[0.82rem] font-semibold text-muted-foreground">{label}</span>
              <Icon className={`size-[18px] ${accent ? "text-brand" : "text-muted-foreground"}`} />
            </div>
            <b className={`block text-[1.9rem] font-extrabold tabular-nums ${accent ? "text-brand" : ""}`}>{value}</b>
          </Link>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[1.1rem] font-bold">Recent leads</h2>
        <Button asChild variant="outline" size="sm"><Link href="/admin/leads">View all</Link></Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card shadow-xs">
        <table className="w-full min-w-[640px] border-collapse">
          <caption className="sr-only">The five most recent enquiries from the website</caption>
          <thead>
            <tr className="bg-muted">
              {["Name", "Phone", "Interested in", "When"].map((h) => (
                <th key={h} scope="col" className="border-b px-4 py-3.5 text-left text-[0.74rem] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.slice(0, 5).map((l) => (
              <tr key={l.id} className="transition-colors hover:bg-muted/50">
                <td className="border-b px-4 py-3.5 text-[0.9rem] font-bold">{l.name ?? "—"}</td>
                <td className="border-b px-4 py-3.5 text-[0.9rem] text-muted-foreground">{l.phone ?? "—"}</td>
                <td className="border-b px-4 py-3.5 text-[0.9rem] text-muted-foreground">{l.product ?? "—"}</td>
                <td className="border-b px-4 py-3.5 text-[0.9rem] text-muted-foreground">
                  {l.created_at ? new Date(l.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[0.9rem] text-muted-foreground">
                  {supabaseConfigured ? "No leads yet." : "Leads appear here once Supabase is connected."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
