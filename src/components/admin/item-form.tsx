"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import type { ActionResult } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type Action = (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>;

export function ItemForm({
  action, children, submitLabel = "Save", onSaved,
}: {
  action: Action;
  children: React.ReactNode;
  submitLabel?: string;
  onSaved?: () => void;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(action, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) { toast.success(state.message); onSaved?.(); }
    else toast.error(state.message);
  }, [state, onSaved]);

  return (
    <form action={formAction} className="space-y-5">
      {children}
      <div className="sticky bottom-0 -mx-1 flex justify-end gap-3 border-t bg-card/95 px-1 py-4 backdrop-blur">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function Field({
  label, name, hint, children, required,
}: {
  label: string; name: string; hint?: string; required?: boolean; children?: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={name} className="mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="mt-1.5 text-[0.76rem] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextField({
  label, name, defaultValue, placeholder, hint, required, type = "text",
}: {
  label: string; name: string; defaultValue?: string | null; placeholder?: string;
  hint?: string; required?: boolean; type?: string;
}) {
  return (
    <Field label={label} name={name} hint={hint} required={required}>
      <Input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} placeholder={placeholder} required={required} />
    </Field>
  );
}

export function AreaField({
  label, name, defaultValue, placeholder, hint, rows = 4,
}: {
  label: string; name: string; defaultValue?: string | null;
  placeholder?: string; hint?: string; rows?: number;
}) {
  return (
    <Field label={label} name={name} hint={hint}>
      <Textarea id={name} name={name} rows={rows} defaultValue={defaultValue ?? ""} placeholder={placeholder} />
    </Field>
  );
}

export function SelectField({
  label, name, defaultValue, options, hint,
}: {
  label: string; name: string; defaultValue?: string | null;
  options: { value: string; label: string }[]; hint?: string;
}) {
  return (
    <Field label={label} name={name} hint={hint}>
      <select
        id={name} name={name} defaultValue={defaultValue ?? options[0]?.value}
        className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}

export function ColorField({
  label, name, defaultValue,
}: { label: string; name: string; defaultValue?: string | null }) {
  return (
    <Field label={label} name={name}>
      <Input id={name} name={name} type="color" defaultValue={defaultValue ?? "#C60000"} className="h-11 cursor-pointer p-1.5" />
    </Field>
  );
}

export function ToggleField({
  label, name, defaultChecked, hint,
}: { label: string; name: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1">
      <Switch id={name} name={name} defaultChecked={defaultChecked} />
      <span>
        <span className="text-[0.9rem] font-semibold">{label}</span>
        {hint && <span className="block text-[0.76rem] text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
      <h2 className="mb-4 text-[1.05rem] font-bold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
