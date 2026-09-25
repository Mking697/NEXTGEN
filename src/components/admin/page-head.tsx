export function PageHead({
  title, sub, children,
}: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-center justify-between gap-3.5">
      <div>
        <h1 className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-extrabold">{title}</h1>
        {sub && <p className="mt-1 text-[0.9rem] text-muted-foreground">{sub}</p>}
      </div>
      {children}
    </div>
  );
}
