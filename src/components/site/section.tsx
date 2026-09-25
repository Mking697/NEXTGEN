import { cn } from "@/lib/utils";

/**
 * `alt` is the near-white band, `dark` is the ink slab.
 *
 * Dark is punctuation, not a background. White -> ink -> white breaks a long
 * page into chapters and reads as deliberate; alternating white and #F5F7FA
 * the whole way down is what made this page feel like a template. Two or three
 * ink slabs is the budget — more and it stops being emphasis.
 *
 * Anything placed inside a dark section must use the --ink-* tokens:
 * --muted-foreground is 3.52:1 against the slab and fails outright.
 */
export function Section({
  children, className, alt, dark, tight, id, ...rest
}: React.ComponentProps<"section"> & { alt?: boolean; dark?: boolean; tight?: boolean }) {
  return (
    <section
      id={id}
      className={cn(
        tight ? "py-16" : "py-20 md:py-24",
        alt && "border-y bg-secondary",
        dark && "bg-ink text-ink-foreground",
        className,
      )}
      {...rest}
    >
      <div className="mx-auto max-w-[1200px] px-5">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow, title, lead, center = true, onDark,
}: {
  eyebrow?: string; title: React.ReactNode; lead?: string;
  center?: boolean; onDark?: boolean;
}) {
  return (
    <div className={cn("mb-12 max-w-[720px]", center && "mx-auto text-center")}>
      {eyebrow && (
        <span className={cn(
          "mb-4 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.09em]",
          onDark ? "text-ink-faint" : "text-muted-foreground",
        )}>
          <span className={cn(
            "h-0.5 w-[22px] rounded-sm",
            onDark
              ? "bg-[linear-gradient(100deg,var(--brand-on-ink),var(--brand))]"
              : "bg-[linear-gradient(100deg,var(--brand-bright),var(--brand-ink))]",
          )} />
          {eyebrow}
        </span>
      )}
      <h2 className="text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold">{title}</h2>
      {lead && (
        <p className={cn(
          "mt-3 text-[clamp(1rem,1.3vw,1.125rem)] leading-relaxed",
          onDark ? "text-ink-dim" : "text-muted-foreground",
          center && "mx-auto max-w-[62ch]",
        )}>
          {lead}
        </p>
      )}
    </div>
  );
}
