"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Search, Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import type { Lead } from "@/lib/types";
import { deleteLead, setLeadStatus } from "@/app/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;

const TONE: Record<string, string> = {
  new: "bg-brand-tint text-brand-ink border-brand-line",
  contacted: "bg-warn-tint text-warn border-warn-line",
  qualified: "bg-muted text-foreground",
  won: "bg-ok-tint text-ok border-ok-line",
  lost: "bg-muted text-muted-foreground",
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [q, setQ] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return leads;
    return leads.filter((l) =>
      [l.name, l.phone, l.email, l.product, l.message]
        .filter(Boolean).join(" ").toLowerCase().includes(t),
    );
  }, [leads, q]);

  function exportCsv() {
    if (!rows.length) { toast.error("Nothing to export."); return; }
    const cols: (keyof Lead)[] = ["name", "phone", "email", "product", "message", "status", "source", "created_at"];
    const csv = [
      cols.join(","),
      ...rows.map((l) => cols.map((c) => `"${String(l[c] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${rows.length} leads.`);
  }

  /** Indian mobiles are usually stored without the country code. */
  const waHref = (phone?: string | null) => {
    const d = String(phone ?? "").replace(/\D/g, "");
    if (!d) return null;
    return `https://wa.me/${d.length === 10 ? "91" + d : d}`;
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="lead-search" className="sr-only">Search leads</label>
          <Input
            id="lead-search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, phone, email or product..." className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={exportCsv}><Download className="size-4" /> Download CSV</Button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{rows.length} leads shown</p>

      <div className="overflow-x-auto rounded-2xl border bg-card shadow-xs">
        <table className="w-full min-w-[900px] border-collapse">
          <caption className="sr-only">All leads received from the website</caption>
          <thead>
            <tr className="bg-muted">
              {["Name", "Phone", "Email", "Interested in", "Message", "Status", "When", ""].map((h, i) => (
                <th key={i} scope="col" className="border-b px-4 py-3.5 text-left text-[0.74rem] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                  {h || <span className="sr-only">Actions</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => {
              const wa = waHref(l.phone);
              return (
                <tr key={l.id} className="transition-colors hover:bg-muted/50">
                  <td className="border-b px-4 py-3.5 text-[0.9rem] font-bold">{l.name ?? "—"}</td>
                  <td className="border-b px-4 py-3.5 text-[0.9rem]">
                    {wa ? (
                      <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-ink hover:underline">
                        <MessageCircle className="size-3.5" /> {l.phone}
                      </a>
                    ) : "—"}
                  </td>
                  <td className="border-b px-4 py-3.5 text-[0.9rem]">
                    {l.email ? <a href={`mailto:${l.email}`} className="text-brand-ink hover:underline">{l.email}</a> : "—"}
                  </td>
                  <td className="border-b px-4 py-3.5 text-[0.9rem] text-muted-foreground">{l.product ?? "—"}</td>
                  <td className="border-b px-4 py-3.5 text-[0.9rem] text-muted-foreground">
                    <span className="line-clamp-2 max-w-[260px]">{l.message ?? "—"}</span>
                  </td>
                  <td className="border-b px-4 py-3.5">
                    <label className="sr-only" htmlFor={`st-${l.id}`}>Status for {l.name ?? "lead"}</label>
                    <select
                      id={`st-${l.id}`}
                      defaultValue={l.status ?? "new"}
                      disabled={pending}
                      onChange={(e) =>
                        start(async () => {
                          const r = await setLeadStatus(l.id!, e.target.value);
                          r.ok ? toast.success(r.message) : toast.error(r.message);
                          router.refresh();
                        })
                      }
                      className="h-8 rounded-md border border-input bg-background px-2 text-[0.82rem]"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="border-b px-4 py-3.5 whitespace-nowrap text-[0.9rem] text-muted-foreground">
                    {l.created_at
                      ? new Date(l.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                      : "—"}
                  </td>
                  <td className="border-b px-4 py-3.5 text-right">
                    <Button
                      variant="outline" size="icon" aria-label={`Delete lead from ${l.name ?? "unknown"}`}
                      disabled={pending}
                      className="hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() =>
                        start(async () => {
                          const r = await deleteLead(l.id!);
                          r.ok ? toast.success(r.message) : toast.error(r.message);
                          router.refresh();
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[0.9rem] text-muted-foreground">
                  {leads.length ? "No leads match that search." : "No leads yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Badge key={s} variant="outline" className={TONE[s]}>
            {s}: {leads.filter((l) => (l.status ?? "new") === s).length}
          </Badge>
        ))}
      </div>
    </>
  );
}
