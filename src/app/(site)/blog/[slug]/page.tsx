import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/section";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { Reveal } from "@/components/site/reveal";
import { PostCard } from "@/components/site/post-card";
import { MarkdownLite } from "@/components/site/markdown-lite";
import { BreadcrumbLd, BlogPostingLd } from "@/components/site/structured-data";
import { getPost, getPosts, getSettings, waLink } from "@/lib/data";
import { siteUrl } from "@/lib/site-url";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return { title: "Post not found" };
  return {
    title: p.seo_title ?? p.title,
    description: p.seo_description ?? p.excerpt ?? undefined,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: {
      title: p.seo_title ?? p.title,
      description: p.seo_description ?? p.excerpt ?? undefined,
      type: "article",
      ...(p.cover_image_url ? { images: [{ url: p.cover_image_url, width: 1200, height: 675, alt: p.title }] } : {}),
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, all, settings] = await Promise.all([getPost(slug), getPosts(), getSettings()]);
  if (!p || p.published === false) notFound();

  const base = siteUrl(settings.brand.url);
  const related = all.filter((x) => x.slug !== p.slug).slice(0, 3);
  const wa = waLink(settings.contact.whatsapp, `Hi, I read "${p.title}" and want to know more.`);

  return (
    <>
      <BreadcrumbLd
        base={base}
        items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: p.title, path: `/blog/${p.slug}` }]}
      />
      <BlogPostingLd base={base} post={p} />

      <Section className="pt-12">
        <div className="mx-auto max-w-[760px]">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }]} current={p.title} />

          {p.category && (
            <span className="mb-3 block text-center text-[0.76rem] font-extrabold uppercase tracking-[0.08em] text-brand-ink">
              {p.category}
            </span>
          )}
          <h1 className="text-center text-[clamp(1.8rem,4.4vw,2.6rem)] font-extrabold leading-[1.1]">{p.title}</h1>
          {p.excerpt && (
            <p className="mx-auto mt-4 max-w-[62ch] text-center text-[1.05rem] text-muted-foreground">{p.excerpt}</p>
          )}
          <p className="mt-4 text-center text-[0.85rem] text-muted-foreground">{p.read_minutes ?? 4} min read</p>

          {p.cover_image_url && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[22px] border bg-muted shadow-lg">
              <Image src={p.cover_image_url} alt={p.title} fill sizes="(max-width:1024px) 100vw, 760px" className="object-cover" />
            </div>
          )}

          <Reveal className="mt-10">
            {p.content ? <MarkdownLite content={p.content} /> : null}
          </Reveal>

          <div className="mt-10 rounded-3xl border bg-card p-6 text-center shadow-lg sm:p-8">
            <h2 className="mb-2 text-[1.2rem] font-bold">Want help with this?</h2>
            <p className="mb-5 text-[0.92rem] text-muted-foreground">
              Send us one message describing your business. You will get a straight answer, not a pitch.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild className="btn-shine bg-wa text-wa-ink hover:bg-wa/90">
                <a href={wa} target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>
              </Button>
              <Button asChild variant="outline"><Link href="/contact">Book a free demo</Link></Button>
            </div>
          </div>

          <Button asChild variant="ghost" size="sm" className="mt-8 -ml-2">
            <Link href="/blog"><ArrowLeft className="size-4" /> Back to the blog</Link>
          </Button>
        </div>
      </Section>

      {related.length > 0 && (
        <Section alt>
          <h2 className="mb-10 text-center text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold">More reading</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <Reveal key={r.slug} delay={i * 80} className="h-full">
                <PostCard post={r} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
