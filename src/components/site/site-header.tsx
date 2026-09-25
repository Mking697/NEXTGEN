"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ whatsappHref }: { whatsappHref: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change, and let Escape out of the mobile drawer.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[72px] bg-background transition-shadow duration-200",
        scrolled && "border-b shadow-sm",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-5 px-5">
        <Link href="/" aria-label="Essor Automations home" className="shrink-0">
          <Image
            src="/brand/logo-wide.png"
            alt="Essor Automations"
            width={420}
            height={140}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-[0.92rem] font-semibold transition-colors",
                  active
                    ? "text-foreground shadow-[inset_0_-2px_0_var(--brand)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/contact">Free Demo</Link>
          </Button>
          {/* Green survives every breakpoint: a cold visitor can tap to chat
              without scrolling, at any width. */}
          <Button
            asChild
            size="sm"
            className="bg-wa text-wa-ink hover:bg-wa/90"
          >
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-xl border border-input lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* visibility:hidden, not just translate — a moved-but-visible drawer
          keeps its links in the tab order and the accessibility tree. */}
      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-x-0 top-[72px] max-h-[calc(100vh-72px)] overflow-auto border-b bg-background px-5 pb-6 pt-4 shadow-lg transition-transform duration-300 lg:hidden",
          open ? "visible translate-y-0" : "invisible -translate-y-[130%]",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl px-4 py-3.5 text-base font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Button asChild variant="outline" className="mt-2">
            <Link href="/contact">Book a Free Demo</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
