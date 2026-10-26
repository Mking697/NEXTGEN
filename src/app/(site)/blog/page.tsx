import type { Metadata } from "next";
import { Section } from "@/components/site/section";
import { PostCard } from "@/components/site/post-card";
import { Reveal } from "@/components/site/reveal";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guides on business software, WhatsApp automation, GST billing and growing an Indian business — from the team that builds the products.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <section className="border-b bg-secondary py-14 text-center">
        <div className="mx-auto max-w-[1200px] px-5">
          <Breadcrumb items={[{ href: "/", label: "Home" }]} current="Blog" />
          <h1 className="text-[clamp(1.9rem,4.4vw,3.1rem)] font-extrabold">
            Guides for running your business <span className="text-brand-ink">better, not just bigger</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[62ch] text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
            Practical writing on software, billing, WhatsApp automation and growth — from the team that
            actually builds and runs these products.
          </p>
        </div>
      </section>

      <Section>
        {posts.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 80} className="h-full">
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">New posts are on the way.</p>
        )}
      </Section>
    </>
  );
}
