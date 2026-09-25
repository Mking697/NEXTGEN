import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/admin/page-head";
import { SetupBanner } from "@/components/admin/setup-banner";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProduct } from "@/app/actions/admin";
import { getProducts } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase/server";

const STATUS = {
  live: "bg-ok-tint text-ok border-ok-line",
  beta: "bg-brand-tint text-brand-ink border-brand-line",
  soon: "bg-warn-tint text-warn border-warn-line",
} as const;

export default async function AdminProducts() {
  const products = await getProducts({ includeHidden: true });

  return (
    <>
      <PageHead title="Products" sub="Add, edit, hide or delete. The website updates immediately.">
        <Button asChild><Link href="/admin/products/new"><Plus className="size-4" /> New product</Link></Button>
      </PageHead>
      {!supabaseConfigured && <SetupBanner />}

      <div className="overflow-x-auto rounded-2xl border bg-card shadow-xs">
        <table className="w-full min-w-[720px] border-collapse">
          <caption className="sr-only">All products, including hidden ones</caption>
          <thead>
            <tr className="bg-muted">
              {["#", "Product", "Category", "Status", "Visible", ""].map((h, i) => (
                <th key={i} scope="col" className={`border-b px-4 py-3.5 text-[0.74rem] font-extrabold uppercase tracking-[0.1em] text-muted-foreground ${i === 5 ? "text-right" : "text-left"}`}>
                  {h || <span className="sr-only">Actions</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.slug} className="transition-colors hover:bg-muted/50">
                <td className="border-b px-4 py-3.5 text-[0.9rem] text-muted-foreground">{p.sort_order ?? "—"}</td>
                <td className="border-b px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink text-[0.8rem] font-black text-ink-foreground">
                      {p.logo_text ?? p.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <b className="block text-[0.93rem] font-bold">{p.name}</b>
                      <small className="block truncate text-[0.76rem] text-muted-foreground">{p.tagline ?? p.slug}</small>
                    </span>
                  </div>
                </td>
                <td className="border-b px-4 py-3.5 text-[0.9rem] text-muted-foreground">{p.category ?? "—"}</td>
                <td className="border-b px-4 py-3.5">
                  <Badge variant="outline" className={STATUS[(p.status ?? "live") as keyof typeof STATUS]}>
                    {p.status ?? "live"}
                  </Badge>
                </td>
                <td className="border-b px-4 py-3.5 text-[0.9rem] text-muted-foreground">
                  {p.published === false ? "Hidden" : "Visible"}
                </td>
                <td className="border-b px-4 py-3.5">
                  <div className="flex justify-end gap-2">
                    {p.url && (
                      <Button asChild variant="outline" size="icon" aria-label={`Open ${p.name} site`}>
                        <a href={p.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" /></a>
                      </Button>
                    )}
                    <Button asChild variant="outline" size="icon" aria-label={`Edit ${p.name}`}>
                      <Link href={`/admin/products/${p.slug}`}><Pencil className="size-4" /></Link>
                    </Button>
                    {p.id && <DeleteButton id={p.id} name={p.name} action={deleteProduct} />}
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
