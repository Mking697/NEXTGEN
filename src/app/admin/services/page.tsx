import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/admin/page-head";
import { SetupBanner } from "@/components/admin/setup-banner";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteService } from "@/app/actions/admin";
import { getServices } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase/server";

export default async function AdminServices() {
  const services = await getServices({ includeHidden: true });

  return (
    <>
      <PageHead title="Services" sub="Your agency services — ads, web, automation, SEO and anything else you offer.">
        <Button asChild><Link href="/admin/services/new"><Plus className="size-4" /> New service</Link></Button>
      </PageHead>
      {!supabaseConfigured && <SetupBanner />}

      <div className="overflow-x-auto rounded-2xl border bg-card shadow-xs">
        <table className="w-full min-w-[680px] border-collapse">
          <caption className="sr-only">All services, including hidden ones</caption>
          <thead>
            <tr className="bg-muted">
              {["#", "Service", "Category", "Visible", ""].map((h, i) => (
                <th key={i} scope="col" className={`border-b px-4 py-3.5 text-[0.74rem] font-extrabold uppercase tracking-[0.1em] text-muted-foreground ${i === 4 ? "text-right" : "text-left"}`}>
                  {h || <span className="sr-only">Actions</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.slug} className="transition-colors hover:bg-muted/50">
                <td className="border-b px-4 py-3.5 text-[0.9rem] text-muted-foreground">{s.sort_order ?? "—"}</td>
                <td className="border-b px-4 py-3.5">
                  <b className="block text-[0.93rem] font-bold">{s.name}</b>
                  <small className="block truncate text-[0.76rem] text-muted-foreground">{s.tagline ?? s.slug}</small>
                </td>
                <td className="border-b px-4 py-3.5 text-[0.9rem] text-muted-foreground">{s.category ?? "—"}</td>
                <td className="border-b px-4 py-3.5 text-[0.9rem] text-muted-foreground">
                  {s.published === false ? "Hidden" : "Visible"}
                </td>
                <td className="border-b px-4 py-3.5">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="icon" aria-label={`Edit ${s.name}`}>
                      <Link href={`/admin/services/${s.slug}`}><Pencil className="size-4" /></Link>
                    </Button>
                    {s.id && <DeleteButton id={s.id} name={s.name} action={deleteService} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
