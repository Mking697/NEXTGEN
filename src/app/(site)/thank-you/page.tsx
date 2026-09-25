import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSettings, waLink } from "@/lib/data";

export const metadata: Metadata = {
  title: "Thank You",
  description: "We have received your request and will contact you shortly.",
  robots: { index: false, follow: true },
};

export default async function ThankYouPage() {
  const { contact } = await getSettings();
  return (
    <section className="grid min-h-[60vh] place-items-center py-20">
      <div className="mx-auto max-w-[640px] px-5 text-center">
        <div className="mx-auto mb-6 grid size-[74px] place-items-center rounded-2xl border border-ok-line bg-ok-tint text-ok">
          <Check className="size-8" strokeWidth={3} />
        </div>
        <h1 className="text-[clamp(1.9rem,4.4vw,2.6rem)] font-extrabold">Thank you — we have your request</h1>
        <p className="mt-4 text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
          Our team is looking at your details and will contact you{" "}
          <strong className="text-foreground">within 24 hours</strong>. If you would rather talk sooner,
          message us on WhatsApp — that is where we reply fastest.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3.5">
          <Button asChild size="lg" className="bg-wa text-wa-ink hover:bg-wa/90">
            <a href={waLink(contact.whatsapp, "Hi, I just submitted a request on your website.")} target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline"><Link href="/products">Browse products</Link></Button>
        </div>
        <p className="mt-6 text-[0.88rem] text-muted-foreground">
          Or call us on{" "}
          <a className="text-brand-ink underline underline-offset-4" href={`tel:${contact.phone.replace(/\s/g, "")}`}>
            {contact.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
