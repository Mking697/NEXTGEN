"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, type ActionResult } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ disabled }: { disabled?: boolean }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(signIn, null);
  const next = useSearchParams().get("next") ?? "/admin";

  return (
    <form action={action} className="rounded-3xl border bg-card p-7 shadow-lg">
      <h1 className="mb-5 text-center text-2xl font-extrabold">Admin Panel</h1>

      <div role="alert" className="empty:hidden">
        {state && !state.ok && (
          <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-[0.89rem] font-semibold text-destructive">
            {state.message}
          </p>
        )}
      </div>

      <input type="hidden" name="next" value={next} />

      <div className="mb-4">
        <Label htmlFor="email" className="mb-1.5">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required disabled={disabled} placeholder="you@essorautomations.in" />
      </div>
      <div className="mb-5">
        <Label htmlFor="password" className="mb-1.5">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required disabled={disabled} placeholder="••••••••" />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending || disabled}>
        {pending ? "Checking..." : "Log in"}
      </Button>
    </form>
  );
}
