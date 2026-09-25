import { cn } from "@/lib/utils";

export function Section({
  children, className, alt, tight, id, ...rest
}: React.ComponentProps<"section"> & { alt?: boolean; tight?: boolean }) {
  return (
    <section
      id={id}
      className={cn(
        tight ? "py-16" : "py-20 md:py-24",
        alt && "border-y bg-secondary",
        className,
      )}
      {...rest}
    >
      <div className="mx-auto max-w-[1200px] px-5">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow, title, lead, center = true,
}: { eyebrow?: string; title: React.ReactNode; lead?: string; center?: boolean }) {
  return (
    <div className={cn("mb-12 max-w-[720px]", center && "mx-auto text-center")}>
      {eyebrow && (
        <span className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.09em] text-muted-foreground">
          <span className="h-0.5 w-[22px] rounded-sm bg-[linear-gradient(100deg,var(--brand-bright),var(--brand-ink))]" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold">{title}</h2>
      {lead && (
        <p className={cn("mt-3 text-[clamp(1rem,1.3vw,1.125rem)] leading-relaxed text-muted-foreground", center && "mx-auto max-w-[62ch]")}>
          {lead}
        </p>
      )}
    </div>
  );
}
