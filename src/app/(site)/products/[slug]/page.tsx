import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/section";
import { ProductCard } from "@/components/site/product-card";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { getProduct, getProducts, getSettings, waLink } from "@/lib/data";

export async function generateStaticParams() {
  const products = await getProducts({ includeHidden: true });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: `${p.name} — ${p.tagline ?? ""}`.trim(),
    description: p.description ?? undefined,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.name, description: p.description ?? undefined, type: "website" },
  };
}

const STATUS = {
  live: { label: "Live", cls: "bg-ok-tint text-ok border-ok-line" },
  beta: { label: "Beta", cls: "bg-brand-tint text-brand-ink border-brand-line" },
  soon: { label: "Coming soon", cls: "bg-warn-tint text-warn border-warn-line" },
} as const;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, all, settings] = await Promise.all([getProduct(slug), getProducts(), getSettings()]);
  if (!p || p.published === false) notFound();

  const st = STATUS[(p.status ?? "live") as keyof typeof STATUS] ?? STATUS.live;
  const isLive = p.status === "live" && p.url;
  const related = all.filter((x) => x.slug !== p.slug).slice(0, 3);
  const wa = waLink(settings.contact.whatsapp, `Hi, I would like to know more about ${p.name}.`);

  return (
    <>
      <Section className="pt-12">
        <Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/products", label: "Products" }]} current={p.name} />
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-ink text-[1.5rem] font-black text-ink-foreground">
                {p.logo_text ?? p.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <Badge variant="outline" className={`gap-1.5 ${st.cls}`}>
                  {p.status === "live" && <span className="size-1.5 rounded-full bg-ok" />}{st.label}
                </Badge>
                <div className="mt-1.5 text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">{p.category}</div>
              </div>
            </div>

            <h1 className="text-[clamp(2.05rem,5.6vw,3.35rem)] font-extrabold leading-[1.08]">{p.name}</h1>
            <p className="mt-3 text-[clamp(1rem,1.3vw,1.125rem)] font-bold">{p.tagline}</p>
            <p className="mt-3 text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">{p.long_description ?? p.description}</p>

            {!!p.highlights?.length && (
              <ul className="mt-6 space-y-1">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3.5 py-2.5 text-[0.96rem] text-muted-foreground">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-ok-line bg-ok-tint text-ok">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-7 flex flex-wrap gap-3.5">
              <Button asChild size="lg" className="bg-wa text-wa-ink hover:bg-wa/90">
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  {isLive ? "Book a free demo" : "Request early access"}
                </a>
              </Button>
              {isLive && (
                <Button asChild size="lg" variant="outline">
                  <a href={p.url!} target="_blank" rel="noopener noreferrer">
                    Visit live site <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-lg sm:p-8">
            <h2 className="mb-5 text-[1.2rem] font-bold">What you get</h2>
            {p.features?.length ? (
              <ul className="space-y-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3.5 py-2 text-[0.96rem]">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-ok-line bg-ok-tint text-ok">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <b className="font-bold">{f}</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Feature list coming soon.</p>
            )}
            <div className="mt-6 border-t pt-6">
              <p className="text-[0.9rem] text-muted-foreground">{p.price ?? p.price_note ?? "Pricing on request"}</p>
              <Button asChild className="mt-4 w-full"><Link href={`/contact?product=${p.slug}`}>Request a quote</Link></Button>
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section alt>
          <h2 className="mb-10 text-center text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold">More products</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <ProductCard key={r.slug} p={r} whatsapp={settings.contact.whatsapp} />)}
          </div>
        </Section>
      )}
    </>
  );
}
