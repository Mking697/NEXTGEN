import Link from "next/link";
import { ArrowUpRight, Check, X, ArrowUp, Zap, Building2, SlidersHorizontal, Smartphone, ShieldCheck, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHead } from "@/components/site/section";
import { ProductCard } from "@/components/site/product-card";
import { ServiceCard } from "@/components/site/service-card";
import { BrandMoment } from "@/components/site/brand-moment";
import { MeshGradient } from "@/components/site/mesh-gradient";
import { Reveal } from "@/components/site/reveal";
import { Counter } from "@/components/site/counter";
import { LeadForm } from "@/components/site/lead-form";
import { FaqLd } from "@/components/site/structured-data";
import { getProducts, getServices, getSettings, waLink } from "@/lib/data";

export default async function HomePage() {
  const [settings, products, services] = await Promise.all([
    getSettings(), getProducts(), getServices(),
  ]);
  const { hero, contact, trust, audiences, cta, faq } = settings;
  const wa = (t: string) => waLink(contact.whatsapp, t);
  const liveProducts = products.filter((p) => p.status === "live" && p.url);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-[radial-gradient(1100px_520px_at_88%_-10%,rgba(248,0,0,.07),transparent_62%),radial-gradient(760px_420px_at_4%_8%,rgba(198,0,0,.045),transparent_60%)] py-14 md:py-20">
        {/* Behind everything, and pointer-events-none so it can never swallow a
            tap on the CTA. The section's own gradient stays underneath as the
            fallback for anyone the shader refuses to run for. */}
        <MeshGradient className="pointer-events-none absolute inset-0 size-full" />
        <svg
          className="pointer-events-none absolute -right-[6%] top-[12%] hidden w-[52%] max-w-[640px] opacity-10 lg:block"
          viewBox="0 0 600 260" fill="none" aria-hidden="true"
        >
          <path d="M8 196C120 250 300 238 404 170 468 128 498 76 512 30" stroke="url(#sw)" strokeWidth="26" strokeLinecap="round" />
          <path d="M470 18 L524 12 L518 66 Z" fill="#E70000" />
          <defs>
            <linearGradient id="sw" x1="0" y1="200" x2="520" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F80000" /><stop offset="1" stopColor="#A30000" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-5 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          <div>
            <span className="mb-5 inline-flex items-center gap-2.5 rounded-full border bg-muted py-1.5 pl-2 pr-4 text-[0.82rem] font-semibold text-muted-foreground">
              <b className="rounded-full border border-ok-line bg-ok-tint px-2.5 py-0.5 text-[0.72rem] font-extrabold tracking-wide text-ok">
                {liveProducts.length} LIVE
              </b>
              <span className="size-[7px] rounded-full bg-ok" />
              {hero.pill}
            </span>

            <h1 className="text-[clamp(2.05rem,5.6vw,3.35rem)] font-extrabold leading-[1.08]">
              {hero.title_lead}{" "}
              <span className="text-brand-ink">{hero.title_accent}</span>{" "}
              {hero.title_tail}
            </h1>

            {/* muted-strong, not muted-foreground: this paragraph sits directly
                on the mesh, where #616A78 measures 3.24:1 and fails 1.4.3. */}
            <p className="mt-5 max-w-[62ch] text-[clamp(1.02rem,1.5vw,1.18rem)] leading-relaxed text-muted-strong">
              {hero.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap gap-3.5">
              <Button asChild size="lg"><Link href="/contact">{hero.cta_primary}</Link></Button>
              <Button asChild size="lg" className="bg-wa text-wa-ink hover:bg-wa/90">
                <a href={wa("Hi, I saw your website. I would like to know which product fits my business.")} target="_blank" rel="noopener noreferrer">
                  {hero.cta_whatsapp}
                </a>
              </Button>
            </div>
          </div>

          {/* The proof card: five domains a visitor can open and check in one
              tap. With no testimonials and no prices, this is the trust. */}
          <Reveal delay={120}>
            <div className="rounded-[22px] border border-input/30 bg-card p-5 shadow-lg">
              <div className="flex items-center gap-2.5 text-[0.95rem]">
                <span className="size-[7px] rounded-full bg-ok" />
                <b className="font-bold">Live in production right now</b>
              </div>
              <p className="mb-4 mt-1.5 text-[0.83rem] text-muted-foreground">
                Open any of them. These are real, working products — not mockups.
              </p>
              {liveProducts.map((p) => (
                <a
                  key={p.slug}
                  href={p.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 border-b px-2.5 py-3 transition-colors last:border-b-0 hover:bg-muted"
                >
                  <span className="grid size-[38px] shrink-0 place-items-center rounded-xl bg-ink text-[0.78rem] font-black text-ink-foreground">
                    {p.logo_text ?? p.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className="block text-[0.9rem] font-bold">{p.name}</b>
                    <small className="block text-[0.8rem] text-muted-foreground">
                      {p.url!.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </small>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ TRUST BAND ============ */}
      <Section dark tight aria-label="Company numbers">
        <div className="grid gap-6 text-center sm:grid-cols-3">
          {trust.map((t, i) => (
            <Reveal key={t.label} delay={i * 80}>
              <b className="block text-[clamp(1.7rem,3.4vw,2.4rem)] font-extrabold leading-tight tabular-nums text-brand-on-ink">
                <Counter value={t.value} />
              </b>
              <span className="mt-1.5 block text-[0.8125rem] font-semibold text-ink-dim">{t.label}</span>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============ AUDIENCE ============ */}
      <Section tight>
        <p className="mb-5 text-center text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Built for</p>
        <ul className="flex flex-wrap justify-center gap-3">
          {audiences.map((a) => (
            <li key={a} className="rounded-full border bg-card px-4.5 px-[18px] py-2.5 text-[0.89rem] font-semibold text-muted-foreground">
              {a}
            </li>
          ))}
        </ul>
      </Section>

      {/* ============ PRODUCTS ============ */}
      <Section id="products" alt>
        <SectionHead
          eyebrow="Our Products"
          title="Software you can start using this week"
          lead="Each one solves a specific problem for a specific kind of business. Five are already live, so you can open them and check for yourself."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80} className="h-full">
              <ProductCard p={p} whatsapp={contact.whatsapp} />
            </Reveal>
          ))}
        </div>
        <div className="mt-11 text-center">
          <Button asChild variant="outline" size="lg"><Link href="/products">See all {products.length} products</Link></Button>
        </div>
      </Section>

      <BrandMoment />

      {/* ============ SERVICES ============ */}
      <Section id="services" alt>
        <SectionHead
          eyebrow="Our Services"
          title="And the team that brings you the customers"
          lead="Good software is half the job. We also run the Meta and Google campaigns, build the landing pages, and set up the automation that turns clicks into real enquiries."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 80} className="h-full">
              <ServiceCard s={s} whatsapp={contact.whatsapp} />
            </Reveal>
          ))}
        </div>
        <div className="mt-11 text-center">
          <Button asChild variant="outline" size="lg"><Link href="/services">See all services</Link></Button>
        </div>
      </Section>

      {/* ============ CTA BAND ============ */}
      <Section tight>
        <Reveal>
          <div className="rounded-3xl bg-ink px-6 py-12 text-center text-ink-foreground md:px-16 md:py-16">
            <h2 className="mb-2 text-[clamp(1.4rem,2.8vw,2rem)] font-extrabold">{cta.title}</h2>
            <p className="mx-auto max-w-[62ch] text-[clamp(1rem,1.3vw,1.125rem)] text-ink-dim">{cta.subtitle}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3.5">
              <Button asChild size="lg" className="bg-wa text-wa-ink hover:bg-wa/90">
                <a href={wa("Hi, I run a business and want to know which of your products or services fits.")} target="_blank" rel="noopener noreferrer">
                  Ask on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>Call {contact.phone}</a>
              </Button>
              {contact.phone2 && (
                <Button asChild size="lg" variant="outline" className="border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <a href={`tel:${contact.phone2.replace(/\s/g, "")}`}>Call {contact.phone2}</a>
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ============ WHY US ============ */}
      <Section id="why">
        <SectionHead
          eyebrow="Why Essor"
          title="A product company, not an agency promising to build one"
          lead="Most people offer to build software for you. Ours is already built, already deployed and already running. That is why our timelines are in weeks, not years."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { Icon: Zap, t: "Ready today", d: "The product exists and runs. Your project is setup, data import and training — not development from zero." },
            { Icon: Building2, t: "We built it, we run it", d: "No reselling, no white-labelling. Our code, our servers, our support. Bugs go straight to the people who wrote them." },
            { Icon: SlidersHorizontal, t: "Fitted to your process", d: "Every business runs differently. Fields, workflows, invoice formats and reports are configured to match yours." },
            { Icon: Smartphone, t: "Works properly on a phone", d: "Everything runs on mobile. Owners can check the numbers without sitting at the shop counter." },
            { Icon: ShieldCheck, t: "Your data stays yours", d: "Role-based access, regular backups and a full export option. Take your data out whenever you want." },
            { Icon: Headset, t: "Support that answers", d: "Direct on WhatsApp and phone. No ticket queue where you wait a week for a first reply." },
          ].map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={(i % 3) * 80}>
              <div className="h-full rounded-[22px] border bg-card p-7 shadow-xs transition-all duration-200 hover:shadow-md md:hover:-translate-y-[3px]">
                <div className="mb-4 grid size-[52px] place-items-center rounded-2xl border border-brand-line bg-brand-tint text-brand-ink">
                  <Icon className="size-6" />
                </div>
                <h3 className="mb-1.5 text-[1.1rem] font-bold">{t}</h3>
                <p className="text-[0.9375rem] text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============ HOW IT WORKS — sticky rail ============ */}
      <Section id="how" dark>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.09em] text-ink-faint">
              <span className="h-0.5 w-[22px] rounded-sm bg-[linear-gradient(100deg,var(--brand-on-ink),var(--brand))]" />
              How It Works
            </span>
            <h2 className="mb-3 text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold">From first call to live, in four steps</h2>
            <p className="text-[clamp(1rem,1.3vw,1.125rem)] text-ink-dim">
              No long discovery phase, no surprise invoice. You will know the timeline and the number before anything starts.
            </p>
            <Button asChild className="mt-5 bg-wa text-wa-ink hover:bg-wa/90">
              <a href={wa("Hi, I would like to start with a 15-minute call.")} target="_blank" rel="noopener noreferrer">
                Start on WhatsApp
              </a>
            </Button>
          </div>

          <ol className="rail relative grid gap-4.5 gap-[18px] pl-[46px] before:absolute before:bottom-3 before:left-[17px] before:top-3 before:w-0.5 before:rounded-sm before:bg-white/15">
            {[
              { t: "Talk to us", d: "A 15-minute call. You describe how things work today. We tell you which product or service fits — and if none of them do, we say that instead of selling you something." },
              { t: "Fixed quote", d: "You get the scope, the timeline and the price in writing. It does not move unless you ask for something new." },
              { t: "Setup & training", d: "We create your account, import your existing data, configure everything around your process, and train your team until they are comfortable." },
              { t: "Live & supported", d: "You go live, and we stay. Updates, changes, and quick support on WhatsApp when something needs attention." },
            ].map((s, i) => (
              <li key={s.t} className="relative rounded-[22px] bg-card p-6 text-foreground shadow-xl shadow-black/25">
                <span className="absolute -left-[46px] top-5 grid size-9 place-items-center rounded-full border-2 border-brand bg-brand text-[0.9rem] font-extrabold leading-none text-white">
                  {i + 1}
                </span>
                <h3 className="mb-1.5 text-[1.1rem] font-bold">{s.t}</h3>
                <p className="text-[0.9375rem] text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ============ BEFORE / AFTER ============ */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.09em] text-muted-foreground">
              <span className="h-0.5 w-[22px] rounded-sm bg-[linear-gradient(100deg,var(--brand-bright),var(--brand-ink))]" />
              Built for India
            </span>
            <h2 className="mb-3 text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold">Made around the problems small businesses actually have</h2>
            <p className="mb-5 text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
              Spreadsheets everywhere, orders scattered across WhatsApp, accounts in a paper register, and no real idea of the month&rsquo;s numbers until it is already over. That is what these products fix.
            </p>
            <ul className="space-y-1">
              {[
                ["GST-ready", "invoices and reports that match Indian compliance"],
                ["WhatsApp-first", "your customers are already there, so the system works there too"],
                ["Light on slow connections", "fast on ordinary hardware and patchy internet"],
                ["Support in your language", "talk to our team in Hindi or English, whichever you prefer"],
                ["Start small", "begin on a small plan and scale up as the business grows"],
              ].map(([b, rest]) => (
                <li key={b} className="flex items-start gap-3.5 py-2.5 text-[0.96rem] text-muted-foreground">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-ok-line bg-ok-tint text-ok">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span><b className="font-bold text-foreground">{b}</b> — {rest}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6"><Link href="/contact">Tell us your use case</Link></Button>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-3xl border bg-card p-6 shadow-lg sm:p-8">
              <div className="mb-5 flex items-center gap-2 border-b pb-4">
                <span className="size-2.5 rounded-full bg-destructive/70" />
                <span className="size-2.5 rounded-full bg-warn/70" />
                <span className="size-2.5 rounded-full bg-ok/70" />
                <em className="ml-auto text-[0.72rem] font-semibold not-italic text-muted-foreground">before → after</em>
              </div>
              <div className="grid gap-3.5">
                {[
                  { Icon: X, tone: "text-destructive bg-destructive/10", t: "Before", d: "Four spreadsheets, two registers, three WhatsApp groups. Two days to produce one report." },
                  { Icon: Check, tone: "text-ok bg-ok-tint", t: "After", d: "One dashboard. Reports in a click. Live numbers on the owner's phone." },
                  { Icon: ArrowUp, tone: "text-brand bg-brand-tint", t: "Result", d: "Less time lost, fewer mistakes, and decisions made on numbers instead of guesses." },
                ].map(({ Icon, tone, t, d }) => (
                  <div key={t} className="flex items-start gap-3 rounded-xl bg-muted p-3">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-[10px] ${tone}`}><Icon className="size-4.5 size-[18px]" /></span>
                    <span>
                      <b className="block text-[0.9rem] font-bold">{t}</b>
                      <small className="text-[0.82rem] text-muted-foreground">{d}</small>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ============ FAQ ============ */}
      <FaqLd faq={faq} />
      <Section id="faq" alt>
        <SectionHead eyebrow="FAQ" title="The questions everyone asks" />
        <div className="mx-auto max-w-[820px]">
          {faq.map((f, i) => (
            <details key={f.q} open={i === 0} className="group mb-3 overflow-hidden rounded-2xl border bg-card shadow-xs open:shadow-sm">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="shrink-0 text-2xl font-normal leading-none text-brand-ink transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 text-[0.95rem] text-muted-foreground">{f.a}</div>
            </details>
          ))}
        </div>
      </Section>

      {/* ============ CONTACT ============ */}
      <Section id="contact">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.09em] text-muted-foreground">
              <span className="h-0.5 w-[22px] rounded-sm bg-[linear-gradient(100deg,var(--brand-bright),var(--brand-ink))]" />
              Get Started
            </span>
            <h2 className="mb-3 text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold">Which one fits your business?</h2>
            <p className="text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
              A free 15-minute call. We will understand your process and tell you straight what will help — and if nothing we have is right for you, we will say so.
            </p>
            <ul className="mt-5 space-y-1">
              {[
                ["If it does not fit, we tell you", "we will not push a product that will not work"],
                ["Free demo", "no commitment"],
                ["Clear pricing", "no hidden charges"],
                ["A reply within 24 hours", ""],
              ].map(([b, rest]) => (
                <li key={b} className="flex items-start gap-3.5 py-2 text-[0.96rem] text-muted-foreground">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-ok-line bg-ok-tint text-ok">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span><b className="font-bold text-foreground">{b}</b>{rest && ` — ${rest}`}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 grid gap-3">
              <Button asChild size="lg" className="w-fit bg-wa text-wa-ink hover:bg-wa/90">
                <a href={wa("Hi, I would like to talk about my business.")} target="_blank" rel="noopener noreferrer">Talk to us on WhatsApp</a>
              </Button>
              <p className="text-[0.92rem] text-muted-foreground">
                Call <a className="text-brand-ink underline underline-offset-4" href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
                {contact.phone2 && (
                  <>
                    {" · "}
                    <a className="text-brand-ink underline underline-offset-4" href={`tel:${contact.phone2.replace(/\s/g, "")}`}>{contact.phone2}</a>
                  </>
                )}
                {" · "}
                <a className="text-brand-ink underline underline-offset-4" href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
              <p className="text-[0.85rem] text-muted-foreground">{contact.hours}</p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <LeadForm products={products} services={services} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
