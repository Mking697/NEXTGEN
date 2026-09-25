import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/section";
import { ServiceCard } from "@/components/site/service-card";
import { Reveal } from "@/components/site/reveal";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { getServices, getSettings, waLink } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services — Meta Ads, Google Ads, WhatsApp Automation & Web",
  description:
    "Meta and Google Ads management, WhatsApp marketing automation, landing pages, ad creative, SEO and custom software development for Indian businesses.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);

  return (
    <>
      <section className="border-b bg-secondary py-14 text-center">
        <div className="mx-auto max-w-[1200px] px-5">
          <Breadcrumb items={[{ href: "/", label: "Home" }]} current="Services" />
          <h1 className="text-[clamp(1.9rem,4.4vw,3.1rem)] font-extrabold">
            The team that brings you <span className="text-brand-ink">the customers</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[62ch] text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
            Ads, landing pages, automation and SEO — run by the same team that builds the software.
            Take one service or the whole stack.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3.5">
            <Button asChild className="bg-wa text-wa-ink hover:bg-wa/90">
              <a href={waLink(settings.contact.whatsapp, "Hi, I would like a quote for your marketing services.")} target="_blank" rel="noopener noreferrer">
                Get a free quote
              </a>
            </Button>
            <Button asChild variant="outline"><Link href="/contact">Book a Call</Link></Button>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 80} className="h-full">
              <ServiceCard s={s} whatsapp={settings.contact.whatsapp} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
