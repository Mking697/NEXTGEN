import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-5 py-20">
      <div className="mx-auto max-w-[600px] text-center">
        <div className="text-[clamp(4rem,14vw,8rem)] font-black leading-none tracking-tighter text-brand-ink">404</div>
        <h1 className="mt-2 text-[clamp(1.5rem,3.5vw,2.2rem)] font-extrabold">We could not find that page</h1>
        <p className="mt-3 text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
          The link may be out of date, or there is a typo in the address. Try one of these instead.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3.5">
          <Button asChild size="lg"><Link href="/">Home</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/products">Products</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/services">Services</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/contact">Contact</Link></Button>
        </div>
      </div>
    </div>
  );
}
