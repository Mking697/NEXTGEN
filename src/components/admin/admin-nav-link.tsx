"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminNavLink({
  href, exact, children,
}: { href: string; exact?: boolean; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.92rem] font-semibold transition-colors",
        active
          /* A red bar, not a red fill: the admin has no CTA to protect, but a
             filled red nav item would still read as "the action". */
          ? "bg-muted text-foreground shadow-[inset_3px_0_0_var(--brand)]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
