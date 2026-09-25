import Link from "next/link";

export function Breadcrumb({
  items, current,
}: { items: { href: string; label: string }[]; current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-[0.83rem] text-muted-foreground">
      <ol className="flex flex-wrap justify-center gap-2">
        {items.map((i) => (
          <li key={i.href} className="flex gap-2">
            <Link href={i.href} className="hover:text-brand-ink">{i.label}</Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className="text-foreground">{current}</li>
      </ol>
    </nav>
  );
}
