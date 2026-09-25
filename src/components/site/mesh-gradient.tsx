"use client";

import { useEffect, useRef } from "react";
import { initMesh } from "@/lib/mesh-gradient";

/**
 * The hero's animated backdrop.
 *
 * The scrim is not decoration. Against the darkest colour in the mesh palette
 * (#FFB9B9) the sub-headline's #616A78 measures 3.36:1 — a 1.4.3 failure — and
 * the red headline 3.79:1, which only passes because it is large. A 65% white
 * wash lifts the worst case to 4.61:1 and 5.21:1, so every size passes with the
 * shader at its strongest. It lives in this component rather than at the call
 * site so the canvas can never be used without it.
 *
 * The canvas is aria-hidden and carries no meaning: where the shader refuses to
 * run, the gradient underneath is what shows and nothing else changes.
 */
export function MeshGradient({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = initMesh(el);
    return () => handle?.stop();
  }, []);

  return (
    <div aria-hidden="true" className={className}>
      <canvas
        ref={ref}
        className="size-full"
        // Shown until the shader paints, and permanently for anyone it skips.
        style={{ background: "linear-gradient(160deg,#fff 0%,#fff5f5 45%,#ffe9e9 100%)" }}
      />
      <div className="absolute inset-0 bg-white/65" />
    </div>
  );
}
