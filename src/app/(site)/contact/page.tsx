import type { Metadata } from "next";
import { Check, Mail, MessageCircle, Phone } from "lucide-react";
import { Section } from "@/components/site/section";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { LeadForm } from "@/components/site/lead-form";
import { getProducts, getServices, getSettings, waLink } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact & Free Demo",
  description:
    "Book a free demo. WhatsApp, call or fill the form — whichever is easiest. We reply within 24 hours.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const [{ product }, settings, products, services] = await Promise.all([
    searchParams, getSettings(), getProducts(), getServices(),
  ]);
  const { contact } = settings;
  const tel = `tel:${contact.phone.replace(/\s/g, "")}`;
  const tel2 = contact.phone2 ? `tel:${contact.phone2.replace(/\s/g, "")}` : null;
  const wa = waLink(contact.whatsapp, "Hi, I would like to talk about my business.");

  return (
    <>
      <section className="border-b bg-secondary py-14 text-center">
        <div className="mx-auto max-w-[1200px] px-5">
          <Breadcrumb items={[{ href: "/", label: "Home" }]} current="Contact" />
          <h1 className="text-[clamp(1.9rem,4.4vw,3.1rem)] font-extrabold">Let us talk</h1>
          <p className="mx-auto mt-3 max-w-[62ch] text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
            Fifteen minutes. No sales pressure. Tell us how your business runs and we will tell you
            which of our products or services fits &mdash; and if none of them do, we will say that
            instead.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-extrabold">Reach us directly</h2>
            <p className="mb-7 mt-2 text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
              You do not have to fill the form. Use whichever is easiest.
            </p>

            <div className="grid gap-3.5">
              <ContactCard
                href={wa} external
                Icon={MessageCircle}
                title="WhatsApp"
                sub="Fastest — usually a reply within 10 minutes"
                tone="bg-wa/15 border-wa/30 text-wa-ink"
              />
              <ContactCard href={tel} Icon={Phone} title={contact.phone} sub={contact.hours} />
              {tel2 && contact.phone2 && (
                <ContactCard href={tel2} Icon={Phone} title={contact.phone2} sub={contact.hours} />
              )}
              <ContactCard
                href={`mailto:${contact.email}`} Icon={Mail}
                title={contact.email} sub="Best for anything you need to write out in detail"
              />
            </div>

            <div className="mt-8 border-t pt-7">
              <h3 className="text-[1.05rem] font-bold">What happens on the call</h3>
              <ul className="mt-2 space-y-1">
                {[
                  "We understand how your business runs today",
                  "We show a live demo of whatever fits",
                  "You get clear pricing and a timeline",
                  "If it does not fit, we say so — no time wasted",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3.5 py-2 text-[0.96rem] text-muted-foreground">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-ok-line bg-ok-tint text-ok">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <LeadForm products={products} services={services} preselect={product} />
        </div>
      </Section>
    </>
  );
}

function ContactCard({
  href, Icon, title, sub, external, tone,
}: {
  href: string; Icon: React.ElementType; title: string; sub: string;
  external?: boolean; tone?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-4 rounded-[22px] border bg-card p-5 shadow-xs transition-all hover:shadow-md md:hover:-translate-y-[3px]"
    >
      <span className={`grid size-12 shrink-0 place-items-center rounded-2xl border ${tone ?? "border-brand-line bg-brand-tint text-brand-ink"}`}>
        <Icon className="size-5" />
      </span>
      <span className="min-w-0">
        <b className="block truncate font-bold">{title}</b>
        <small className="text-[0.84rem] text-muted-foreground">{sub}</small>
      </span>
    </a>
  );
}
