import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/data";

const STATUS = {
  live: { label: "Live", cls: "bg-ok-tint text-ok border-ok-line" },
  beta: { label: "Beta", cls: "bg-brand-tint text-brand-ink border-brand-line" },
  soon: { label: "Coming soon", cls: "bg-warn-tint text-warn border-warn-line" },
} as const;

const domainOf = (u?: string | null) =>
  (u ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");

export function ProductCard({ p, whatsapp }: { p: Product; whatsapp: string }) {
  const st = STATUS[(p.status ?? "live") as keyof typeof STATUS] ?? STATUS.live;
  const isLive = p.status === "live" && p.url;

  return (
    <article className="relative flex flex-col overflow-hidden rounded-[22px] border bg-card shadow-xs transition-all duration-200 hover:border-input/40 hover:shadow-md md:hover:-translate-y-[3px]">
      {/* The per-product colour lives here and nowhere else. Five saturated
          tiles in a grid on white read as a rainbow and cost the CTA its
          monopoly; a 3px stripe keeps the identity at no cost. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(135deg, ${p.color_from ?? "#C60000"}, ${p.color_to ?? "#A30000"})` }}
      />
      {/* object-top, not object-center: a UI screenshot carries its meaning in
          the top bar and first rows, and centring crops exactly that away. */}
      {p.image_url && (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b bg-muted">
          <Image
            src={p.image_url} alt={`${p.name} screenshot`} fill
            sizes="(max-width:768px) 100vw, 420px"
            className="object-cover object-top"
          />
        </div>
      )}
      <div className="flex items-start gap-4 p-6 pb-0">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-ink text-[1.2rem] font-black text-ink-foreground">
          {p.logo_text ?? p.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-[1.18rem] font-bold">{p.name}</h3>
          <div className="text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            {p.category ?? "Software"}
          </div>
        </div>
        <Badge variant="outline" className={`shrink-0 gap-1.5 ${st.cls}`}>
          {p.status === "live" && <span className="size-1.5 rounded-full bg-ok" />}
          {st.label}
        </Badge>
      </div>

      <div className="flex-1 px-6 pt-4">
        <p className="mb-4 text-[0.9375rem] text-muted-foreground">{p.description ?? p.tagline}</p>
        {!!p.features?.length && (
          <ul className="mb-4 flex flex-wrap gap-1.5">
            {p.features.slice(0, 4).map((f) => (
              <li key={f} className="rounded-lg border bg-muted px-2.5 py-1 text-[0.8125rem] font-semibold text-muted-foreground">
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* A live domain the visitor can open is stronger proof than a
          "pricing on request" row. */}
      {isLive ? (
        <div className="flex items-center gap-2 px-6 text-[0.88rem] text-muted-foreground">
          <span className="size-2 rounded-full bg-ok" />
          <span><strong className="text-foreground">{domainOf(p.url)}</strong> · live now</span>
        </div>
      ) : (
        <div className="px-6 text-[0.9rem] text-muted-foreground">{p.price_note ?? "Pricing on request"}</div>
      )}

      <div className="flex gap-2.5 px-6 pb-2 pt-4">
        <Button asChild size="sm" className="flex-1 bg-wa text-wa-ink hover:bg-wa/90">
          <a href={waLink(whatsapp, `Hi, I would like a demo of ${p.name}.`)} target="_blank" rel="noopener noreferrer">
            Get a demo
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className="flex-1">
          <Link href={`/products/${p.slug}`}>Details</Link>
        </Button>
      </div>

      {isLive ? (
        <a
          href={p.url!}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-6 pb-6 pt-3 text-[0.83rem] font-semibold text-muted-foreground transition-colors hover:text-brand-ink"
        >
          Open {domainOf(p.url)} <ExternalLink className="size-3.5" />
        </a>
      ) : (
        <Link href={`/contact?product=${p.slug}`} className="px-6 pb-6 pt-3 text-[0.83rem] font-semibold text-muted-foreground hover:text-brand-ink">
          Join the early access list →
        </Link>
      )}
    </article>
  );
}
