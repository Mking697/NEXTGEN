import Image from "next/image";
import Link from "next/link";
import type { Product, Service, SiteSettings } from "@/lib/types";

const SOCIALS: { key: keyof SiteSettings["social"]; label: string; path: string }[] = [
  { key: "facebook", label: "Facebook", path: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" },
  { key: "instagram", label: "Instagram", path: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 5.3a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm5.7-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z" },
  { key: "linkedin", label: "LinkedIn", path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21h-4V9Z" },
  { key: "youtube", label: "YouTube", path: "M23 12s0-3.4-.4-5c-.3-.9-1-1.6-1.9-1.9C19 4.7 12 4.7 12 4.7s-7 0-8.7.4c-.9.3-1.6 1-1.9 1.9C1 8.6 1 12 1 12s0 3.4.4 5c.3.9 1 1.6 1.9 1.9 1.7.4 8.7.4 8.7.4s7 0 8.7-.4c.9-.3 1.6-1 1.9-1.9.4-1.6.4-5 .4-5ZM9.8 15.3V8.7l5.8 3.3-5.8 3.3Z" },
  { key: "threads", label: "Threads", path: "M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z" },
];

export function SiteFooter({
  settings, products, services,
}: { settings: SiteSettings; products: Product[]; services: Service[] }) {
  const { contact, social, brand } = settings;
  const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

  return (
    /* Inverted slab: a white footer on a white page gives the scroll no
       terminus. --muted-foreground is 3.52:1 here, so the ink-* tokens are
       not optional. */
    <footer className="mt-12 bg-ink pb-24 pt-16 text-ink-dim">
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="mb-11 grid gap-9 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1.15fr_1fr_1.2fr]">
          <div className="lg:col-auto md:col-span-2 lg:col-span-1">
            {/* The inverted mark, so the logo sits on the slab itself. It used
                to need a white chip behind it here, which read as a patch. */}
            <Link href="/" className="inline-block">
              <Image src="/brand/logo-wide-invert.png" alt="Essor Automations" width={420} height={140} className="h-9 w-auto" />
            </Link>
            <p className="mt-4 max-w-[34ch] text-[0.92rem]">
              Business software built, deployed and maintained in-house — plus the marketing team that fills it with customers.
            </p>
            <div className="mt-5 flex gap-2.5">
              {SOCIALS.filter((s) => social[s.key]).map((s) => (
                <a
                  key={s.key}
                  href={social[s.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-[38px] place-items-center rounded-xl border border-white/20 text-ink-dim transition-colors hover:border-transparent hover:bg-white hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="size-[17px] fill-current">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Products">
            {products.slice(0, 6).map((p) => (
              <FooterLink key={p.slug} href={`/products/${p.slug}`}>{p.name}</FooterLink>
            ))}
            <FooterLink href="/products"><strong>All products →</strong></FooterLink>
          </FooterCol>

          <FooterCol title="Services">
            {services.slice(0, 6).map((s) => (
              <FooterLink key={s.slug} href={`/services/${s.slug}`}>{s.name}</FooterLink>
            ))}
            <FooterLink href="/services"><strong>All services →</strong></FooterLink>
          </FooterCol>

          <FooterCol title="Company">
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/#why">Why Essor</FooterLink>
            <FooterLink href="/#how">How It Works</FooterLink>
            <FooterLink href="/#faq">FAQ</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterCol>

          <FooterCol title="Get in Touch">
            <address className="not-italic leading-[1.9] text-[0.92rem]">
              <a className="hover:text-white" href={tel(contact.phone)}>{contact.phone}</a><br />
              {contact.phone2 && (<><a className="hover:text-white" href={tel(contact.phone2)}>{contact.phone2}</a><br /></>)}
              <a className="hover:text-white" href={`mailto:${contact.email}`}>{contact.email}</a><br />
              {contact.address}<br />
              <span className="text-[0.85rem] text-ink-faint">{contact.hours}</span>
            </address>
          </FooterCol>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3.5 border-t border-white/15 pt-6 text-[0.85rem] text-ink-faint">
          <span>© {new Date().getFullYear()} {brand.name}. All rights reserved.</span>
          <nav aria-label="Legal and policies" className="flex flex-wrap gap-5">
            <Link className="min-h-6 py-1 hover:text-white" href="/privacy">Privacy Policy</Link>
            <Link className="min-h-6 py-1 hover:text-white" href="/terms">Terms &amp; Conditions</Link>
            <Link className="min-h-6 py-1 hover:text-white" href="/refund">Refund Policy</Link>
            <Link className="min-h-6 py-1 hover:text-white" href="/contact">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-[0.79rem] font-extrabold uppercase tracking-[0.14em] text-ink-faint">{title}</h4>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[0.92rem] transition-colors hover:text-white">{children}</Link>
    </li>
  );
}
