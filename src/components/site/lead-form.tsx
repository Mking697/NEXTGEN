"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { submitLead, type LeadResult } from "@/app/actions/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product, Service } from "@/lib/types";

export function LeadForm({
  products, services, preselect,
}: { products: Product[]; services: Service[]; preselect?: string }) {
  const [state, action, pending] = useActionState<LeadResult | null, FormData>(submitLead, null);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  const selected =
    [...products, ...services].find((x) => x.slug === preselect)?.name ?? "";

  return (
    <form ref={formRef} action={action} className="rounded-3xl border bg-card p-6 shadow-lg sm:p-8">
      <h2 className="mb-1.5 text-[clamp(1.3rem,2.4vw,1.7rem)] font-extrabold">Book a Free Demo</h2>
      <p className="mb-6 text-[0.92rem] text-muted-foreground">Fill this in and we will contact you today.</p>

      {/* Two regions, not one: an error must interrupt (role=alert), a
          success should not (role=status). Both stay mounted so the change
          is announced — a region that appears pre-filled says nothing. */}
      <div aria-live="polite" role="status" className="empty:hidden">
        {state?.ok && (
          <p className="mb-4 rounded-lg border border-ok-line bg-ok-tint px-4 py-3 text-[0.89rem] font-semibold text-ok">
            {state.message}
          </p>
        )}
      </div>
      <div role="alert" className="empty:hidden">
        {state && !state.ok && (
          <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-[0.89rem] font-semibold text-destructive">
            {state.message}
          </p>
        )}
      </div>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <div className="mb-4">
          <Label htmlFor={`${uid}-name`} className="mb-1.5">Name <span className="text-destructive">*</span></Label>
          <Input id={`${uid}-name`} name="name" required autoComplete="name" placeholder="Your full name" />
        </div>
        <div className="mb-4">
          <Label htmlFor={`${uid}-phone`} className="mb-1.5">WhatsApp number <span className="text-destructive">*</span></Label>
          <Input id={`${uid}-phone`} name="phone" type="tel" required autoComplete="tel" placeholder="98XXXXXXXX" />
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor={`${uid}-email`} className="mb-1.5">Email</Label>
        <Input id={`${uid}-email`} name="email" type="email" autoComplete="email" placeholder="you@company.com" />
      </div>

      <div className="mb-4">
        <Label htmlFor={`${uid}-product`} className="mb-1.5">What are you interested in?</Label>
        <select
          id={`${uid}-product`}
          name="product"
          defaultValue={selected}
          className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
        >
          <option value="">Select an option</option>
          <optgroup label="Products">
            {products.map((p) => <option key={p.slug} value={p.name}>{p.name}</option>)}
          </optgroup>
          <optgroup label="Services">
            {services.map((s) => <option key={s.slug} value={s.name}>{s.name}</option>)}
          </optgroup>
          <option value="Not sure">Not sure — please advise</option>
        </select>
      </div>

      <div className="mb-4">
        <Label htmlFor={`${uid}-msg`} className="mb-1.5">Tell us about your business</Label>
        <Textarea
          id={`${uid}-msg`} name="message" rows={4}
          placeholder="For example: I run a medical store and need billing and stock management..."
        />
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${uid}-co`}>Company (leave this empty)</label>
        <input id={`${uid}-co`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Send Demo Request"}
      </Button>
      <p className="mt-3 text-[0.79rem] text-muted-foreground">
        Your details are safe with us. We do not spam, and we never sell your data.
      </p>
    </form>
  );
}
