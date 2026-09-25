import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Target, BarChart3, MessageCircle, Zap, SlidersHorizontal, RefreshCw, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/section";
import { ServiceCard } from "@/components/site/service-card";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { getService, getServices, getSettings, waLink } from "@/lib/data";

const ICONS = { target: Target, chart: BarChart3, chat: MessageCircle, zap: Zap, sliders: SlidersHorizontal, refresh: RefreshCw, tool: Wrench } as const;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return { title: "Service not found" };
  return {
    title: `${s.name} — ${s.tagline ?? ""}`.trim(),
    description: s.description ?? undefined,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [s, all, settings] = await Promise.all([getService(slug), getServices(), getSettings()]);
  if (!s || s.published === false) notFound();

  const Icon = ICONS[(s.icon ?? "zap") as keyof typeof ICONS] ?? Zap;
  const related = all.filter((x) => x.slug !== s.slug).slice(0, 3);
  const wa = waLink(settings.contact.whatsapp, `Hi, I am interested in your ${s.name} service.`);

  return (
    <>
      <Section className="pt-12">
        <Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/services", label: "Services" }]} current={s.name} />
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-brand-line bg-brand-tint text-brand-ink">
                <Icon className="size-7" />
              </span>
              <div className="text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">{s.category}</div>
            </div>

            <h1 className="text-[clamp(2.05rem,5.6vw,3.35rem)] font-extrabold leading-[1.08]">{s.name}</h1>
            <p className="mt-3 text-[clamp(1rem,1.3vw,1.125rem)] font-bold">{s.tagline}</p>
            <p className="mt-3 text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">{s.long_description ?? s.description}</p>

            {!!s.outcomes?.length && (
              <>
                <h2 className="mt-8 text-[1.15rem] font-bold">What changes for you</h2>
                <ul className="mt-2 space-y-1">
                  {s.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-3.5 py-2.5 text-[0.96rem] text-muted-foreground">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-ok-line bg-ok-tint text-ok">
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-7 flex flex-wrap gap-3.5">
              <Button asChild size="lg" className="bg-wa text-wa-ink hover:bg-wa/90">
                <a href={wa} target="_blank" rel="noopener noreferrer">Get a free quote</a>
              </Button>
              <Button asChild size="lg" variant="outline"><Link href={`/contact?product=${s.slug}`}>Book a call</Link></Button>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-lg sm:p-8">
            <h2 className="mb-5 text-[1.2rem] font-bold">What is included</h2>
            {s.deliverables?.length ? (
              <ul className="space-y-1">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3.5 py-2 text-[0.96rem]">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-ok-line bg-ok-tint text-ok">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <b className="font-bold">{d}</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Scope is defined after the first call.</p>
            )}
            <div className="mt-6 border-t pt-6">
              <p className="text-[0.9rem] text-muted-foreground">{s.price ?? s.price_note ?? "Pricing on request"}</p>
              <Button asChild className="mt-4 w-full"><Link href={`/contact?product=${s.slug}`}>Talk to us</Link></Button>
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section alt>
          <h2 className="mb-10 text-center text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold">Other services</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <ServiceCard key={r.slug} s={r} whatsapp={settings.contact.whatsapp} />)}
          </div>
        </Section>
      )}
    </>
  );
}
