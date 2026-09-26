import type { Metadata } from "next";
import Link from "next/link";
import { Target, Wrench, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHead } from "@/components/site/section";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { Reveal } from "@/components/site/reveal";
import { Counter } from "@/components/site/counter";
import { getProducts, getSettings, waLink } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Essor Automations is a product company: we build our own business software, deploy it and maintain it in-house, and run the marketing that fills it with customers.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()]);
  const live = products.filter((p) => p.status === "live");

  return (
    <>
      <section className="border-b bg-secondary py-14 text-center">
        <div className="mx-auto max-w-[1200px] px-5">
          <Breadcrumb items={[{ href: "/", label: "Home" }]} current="About" />
          <h1 className="text-[clamp(1.9rem,4.4vw,3.1rem)] font-extrabold">
            We do not just sell software &mdash; <span className="text-brand-ink">we run it</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[62ch] text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
            Essor Automations is a product company. Everything you see here we built ourselves, put on
            our own servers, and monitor every day.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.09em] text-muted-foreground">
              <span className="h-0.5 w-[22px] rounded-sm bg-[linear-gradient(100deg,var(--brand-bright),var(--brand-ink))]" />
              Our Approach
            </span>
            <h2 className="mb-3 text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold">
              Every product started with a real problem
            </h2>
            <p className="mb-4 text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
              We have never built a product by asking what the market wants. Each one started with
              something specific going wrong: enquiries getting lost on WhatsApp, a medical store
              writing off expired stock, an owner with no idea what their ads actually cost per lead.
            </p>
            <p className="text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
              That is why they are not bloated. The features that earn their place are there; the ones
              that only look good in a sales deck are not.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              {settings.trust.map((t) => (
                <div key={t.label} className="rounded-[22px] border bg-card p-6 text-center shadow-xs">
                  <div className="text-[2.2rem] font-extrabold tabular-nums text-brand">
                    <Counter value={t.value} />
                  </div>
                  <p className="mt-1.5 text-[0.86rem] text-muted-foreground">{t.label}</p>
                </div>
              ))}
              <div className="rounded-[22px] border bg-card p-6 text-center shadow-xs">
                <div className="text-[2.2rem] font-extrabold text-brand">100%</div>
                <p className="mt-1.5 text-[0.86rem] text-muted-foreground">Built in-house</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section alt>
        <SectionHead eyebrow="What We Value" title="How we work" />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { Icon: Target, t: "Straight answers", d: "We say what can be done and what cannot. Timeline and price are clear before anything starts." },
            { Icon: Wrench, t: "Software that works", d: "We are not interested in a long feature list. We build and maintain what gets used every day." },
            { Icon: RefreshCw, t: "We stay after launch", d: "Go-live is not the end of the relationship. Updates, changes and support carry on." },
          ].map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 80}>
              <div className="h-full rounded-[22px] border bg-card p-7 text-center shadow-xs">
                <div className="mx-auto mb-4 grid size-[52px] place-items-center rounded-2xl border border-brand-line bg-brand-tint text-brand-ink">
                  <Icon className="size-6" />
                </div>
                <h3 className="mb-1.5 text-[1.1rem] font-bold">{t}</h3>
                <p className="text-[0.9375rem] text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="prose-essor mx-auto max-w-[820px]">
          <h2 className="text-center">Our story</h2>
          <p>
            Essor Automations was founded on <strong>13 January 2022</strong> and builds automation software
            for small and medium businesses. We started with custom development work, and as the same
            problems kept coming up with different clients, we turned those solutions into proper
            products &mdash; so the next business would not have to pay to build the same thing from
            scratch. We have served <strong>32 businesses</strong> so far.
          </p>
          <p>
            Today we have {products.length} products.{" "}
            {live.map((p, i) => (
              <span key={p.slug}>
                <Link href={`/products/${p.slug}`}>{p.name}</Link>
                {i < live.length - 2 ? ", " : i === live.length - 2 ? " and " : ""}
              </span>
            ))}{" "}
            are live, while the rest are in development and open for early access.
          </p>
          <p>
            If something in your business is being done by hand every day and could be done by itself,
            there is a good chance we have already built it.
          </p>
        </div>
      </Section>

      <Section alt tight>
        <div className="rounded-3xl bg-ink px-6 py-12 text-center text-ink-foreground md:px-16">
          <h2 className="mb-2 text-[clamp(1.4rem,2.8vw,2rem)] font-extrabold">Let us have a call</h2>
          <p className="mx-auto max-w-[62ch] text-ink-dim">
            Fifteen minutes is enough to know whether any of this is useful to you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3.5">
            <Button asChild size="lg"><Link href="/contact">Book a Free Demo</Link></Button>
            <Button asChild size="lg" className="bg-wa text-wa-ink hover:bg-wa/90">
              <a
                href={waLink(settings.contact.whatsapp, "Hi, I read your About page and would like to talk.")}
                target="_blank" rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
