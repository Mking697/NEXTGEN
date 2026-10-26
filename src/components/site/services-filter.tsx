"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Service } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ServiceCard } from "@/components/site/service-card";
import { Reveal } from "@/components/site/reveal";

export function ServicesFilter({ services, whatsapp }: { services: Service[]; whatsapp: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(services.map((s) => s.category).filter((c): c is string => !!c))),
    [services],
  );

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return services.filter((s) => {
      const matchesCat = cat === "all" || s.category === cat;
      const matchesQ = !t || [s.name, s.tagline, s.description].filter(Boolean).join(" ").toLowerCase().includes(t);
      return matchesCat && matchesQ;
    });
  }, [services, q, cat]);

  return (
    <>
      <div className="mb-10 flex flex-col items-center gap-4">
        <div className="relative w-full max-w-[420px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="service-search" className="sr-only">Search services</label>
          <Input
            id="service-search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search services..." className="pl-9"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-[0.82rem] font-semibold transition-colors",
                cat === c ? "border-brand bg-brand-tint text-brand-ink" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{rows.length} services shown</p>

      {rows.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 80} className="h-full">
              <ServiceCard s={s} whatsapp={whatsapp} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No services match that search.</p>
      )}
    </>
  );
}
