import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, Package, Briefcase, Inbox, Settings, ExternalLink, LogOut } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { signOut } from "@/app/actions/admin";
import { supabaseConfigured } from "@/lib/supabase/server";
import { AdminNavLink } from "@/components/admin/admin-nav-link";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: LayoutGrid, exact: true },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/services", label: "Services", Icon: Briefcase },
  { href: "/admin/leads", label: "Leads", Icon: Inbox },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-secondary">
      <div className="grid min-h-dvh lg:grid-cols-[248px_1fr]">
        <nav aria-label="Admin sections" className="flex flex-wrap items-center gap-1.5 border-b bg-card p-4 lg:sticky lg:top-0 lg:h-dvh lg:flex-col lg:items-stretch lg:overflow-auto lg:border-b-0 lg:border-r">
          <Link href="/" className="mb-0 w-full px-2 lg:mb-5">
            <Image src="/brand/logo-wide.png" alt="Essor Automations" width={420} height={140} className="h-8 w-auto" />
          </Link>

          {NAV.map(({ href, label, Icon, exact }) => (
            <AdminNavLink key={href} href={href} exact={exact}>
              <Icon className="size-[18px] shrink-0" /> {label}
            </AdminNavLink>
          ))}

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0 lg:mt-auto lg:w-full lg:flex-col lg:items-stretch lg:border-t lg:pt-4">
            <a
              href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.92rem] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ExternalLink className="size-[18px] shrink-0" /> View website
            </a>
            {supabaseConfigured && (
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[0.92rem] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="size-[18px] shrink-0" /> Log out
                </button>
              </form>
            )}
          </div>
        </nav>

        <main className="min-w-0 px-5 pb-16 pt-7 md:px-8">{children}</main>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}
