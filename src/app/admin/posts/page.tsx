import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/admin/page-head";
import { SetupBanner } from "@/components/admin/setup-banner";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePost } from "@/app/actions/admin";
import { getPosts } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase/server";

export default async function AdminPosts() {
  const posts = await getPosts({ includeHidden: true });

  return (
    <>
      <PageHead title="Blog posts" sub="Add, edit, hide or delete. The website updates immediately.">
        <Button asChild><Link href="/admin/posts/new"><Plus className="size-4" /> New post</Link></Button>
      </PageHead>
      {!supabaseConfigured && <SetupBanner />}

      <div className="overflow-x-auto rounded-2xl border bg-card shadow-xs">
        <table className="w-full min-w-[720px] border-collapse">
          <caption className="sr-only">All blog posts, including hidden ones</caption>
          <thead>
            <tr className="bg-muted">
              {["Post", "Category", "Visible", ""].map((h, i) => (
                <th key={i} scope="col" className={`border-b px-4 py-3.5 text-[0.74rem] font-extrabold uppercase tracking-[0.1em] text-muted-foreground ${i === 3 ? "text-right" : "text-left"}`}>
                  {h || <span className="sr-only">Actions</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.slug} className="transition-colors hover:bg-muted/50">
                <td className="border-b px-4 py-3.5">
                  <b className="block text-[0.93rem] font-bold">{p.title}</b>
                  <small className="block truncate text-[0.76rem] text-muted-foreground">{p.slug}</small>
                </td>
                <td className="border-b px-4 py-3.5 text-[0.9rem] text-muted-foreground">{p.category ?? "—"}</td>
                <td className="border-b px-4 py-3.5">
                  <Badge variant="outline" className={p.published === false ? "" : "bg-ok-tint text-ok border-ok-line"}>
                    {p.published === false ? "Hidden" : "Visible"}
                  </Badge>
                </td>
                <td className="border-b px-4 py-3.5">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="icon" aria-label={`Open ${p.title}`}>
                      <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" /></a>
                    </Button>
                    <Button asChild variant="outline" size="icon" aria-label={`Edit ${p.title}`}>
                      <Link href={`/admin/posts/${p.slug}`}><Pencil className="size-4" /></Link>
                    </Button>
                    {p.id && <DeleteButton id={p.id} name={p.title} action={deletePost} />}
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-[0.9rem] text-muted-foreground">No posts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
