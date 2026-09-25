import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { Tracking } from "@/components/site/tracking";
import { getProducts, getServices, getSettings, waLink } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, products, services] = await Promise.all([
    getSettings(), getProducts(), getServices(),
  ]);
  const wa = waLink(
    settings.contact.whatsapp,
    `Hi ${settings.brand.name}, I would like to know more about your products and services.`,
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-[200] focus:rounded-br-lg focus:bg-brand focus:px-5 focus:py-3 focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader whatsappHref={wa} />
      <main id="main" tabIndex={-1} className="outline-none">{children}</main>
      <SiteFooter settings={settings} products={products} services={services} />
      <WhatsAppFab href={wa} />
      <Tracking {...settings.tracking} />
    </>
  );
}
