import { Breadcrumb } from "@/components/site/breadcrumb";
import { Section } from "@/components/site/section";

export function LegalPage({
  title, updated, children,
}: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <>
      <section className="border-b bg-secondary py-14 text-center">
        <div className="mx-auto max-w-[1200px] px-5">
          <Breadcrumb items={[{ href: "/", label: "Home" }]} current={title} />
          <h1 className="text-[clamp(1.9rem,4.4vw,3.1rem)] font-extrabold">{title}</h1>
          <p className="mt-2 text-muted-foreground">Last updated: {updated ?? new Date().getFullYear()}</p>
        </div>
      </section>
      <Section>
        <div className="prose-essor mx-auto max-w-[820px]">{children}</div>
      </Section>
    </>
  );
}
