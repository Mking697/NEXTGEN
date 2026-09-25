import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/section";
import { ProductCard } from "@/components/site/product-card";
import { Reveal } from "@/components/site/reveal";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { getProducts, getSettings, waLink } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Every Essor Automations product: ChatXFlow, DawaiStore, PanelSuite, Autolyst, Admetics, Essor CRM and PRO ERP. Five live in production, two launching soon.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const live = products.filter((p) => p.status === "live").length;

  return (
    <>
      <section className="border-b bg-secondary py-14 text-center">
        <div className="mx-auto max-w-[1200px] px-5">
          <Breadcrumb items={[{ href: "/", label: "Home" }]} current="Products" />
          <h1 className="text-[clamp(1.9rem,4.4vw,3.1rem)] font-extrabold">
            {products.length} products. <span className="text-brand-ink">{live} already live.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[62ch] text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
            Each one is built for a specific kind of business. Read the details and book a free demo of
            whichever fits — the live ones you can open and check right now.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3.5">
            <Button asChild><Link href="/contact">Book a Free Demo</Link></Button>
            <Button asChild className="bg-wa text-wa-ink hover:bg-wa/90">
              <a href={waLink(settings.contact.whatsapp, "Hi, I would like to know which product fits my business.")} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80} className="h-full">
              <ProductCard p={p} whatsapp={settings.contact.whatsapp} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
