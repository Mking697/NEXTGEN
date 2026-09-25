import Link from "next/link";
import Image from "next/image";
import {
  Target, BarChart3, MessageCircle, Zap, SlidersHorizontal, RefreshCw, Wrench,
} from "lucide-react";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/data";

const ICONS = {
  target: Target, chart: BarChart3, chat: MessageCircle, zap: Zap,
  sliders: SlidersHorizontal, refresh: RefreshCw, tool: Wrench,
} as const;

export function ServiceCard({ s, whatsapp }: { s: Service; whatsapp: string }) {
  const Icon = ICONS[(s.icon ?? "zap") as keyof typeof ICONS] ?? Zap;

  return (
    <article className="relative flex flex-col overflow-hidden rounded-[22px] border bg-card p-7 pt-8 shadow-xs transition-all duration-200 hover:border-input/40 hover:shadow-md md:hover:-translate-y-[3px]">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(135deg, ${s.color_from ?? "#C60000"}, ${s.color_to ?? "#A30000"})` }}
      />
      {s.image_url && (
        <div className="relative -mx-7 -mt-8 mb-6 aspect-[16/10] overflow-hidden border-b bg-muted">
          <Image
            src={s.image_url} alt={`${s.name}`} fill
            sizes="(max-width:768px) 100vw, 420px"
            className="object-cover object-top"
          />
        </div>
      )}
      <div className="mb-4 flex items-center gap-4">
        {/* The one place a soft red tint is allowed on a 52px surface:
            services are second-tier conversion, so it reads as
            related-to-CTA rather than competing with it. */}
        <span className="grid size-[52px] shrink-0 place-items-center rounded-2xl border border-brand-line bg-brand-tint text-brand-ink">
          <Icon className="size-6" />
        </span>
        <div>
          <div className="text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            {s.category ?? "Service"}
          </div>
          <h3 className="mt-0.5 text-[1.17rem] font-bold">{s.name}</h3>
        </div>
      </div>

      <p className="mb-3 text-[0.93rem] font-semibold text-muted-foreground">{s.tagline}</p>
      <p className="mb-4 text-[0.9375rem] text-muted-foreground">{s.description}</p>

      {!!s.deliverables?.length && (
        <ul className="mb-6 grid gap-2.5">
          {s.deliverables.slice(0, 4).map((d) => (
            <li key={d} className="relative pl-6 text-[0.87rem] leading-snug text-muted-foreground">
              <span className="absolute left-0.5 top-[0.45em] size-2.5 rounded-sm bg-brand-bright" />
              {d}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap gap-2.5">
        <Button asChild size="sm" className="min-w-[130px] flex-1 bg-wa text-wa-ink hover:bg-wa/90">
          <a href={waLink(whatsapp, `Hi, I would like a quote for ${s.name}.`)} target="_blank" rel="noopener noreferrer">
            Get a quote
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className="min-w-[130px] flex-1">
          <Link href={`/services/${s.slug}`}>What&rsquo;s included</Link>
        </Button>
      </div>
    </article>
  );
}
