"use client";

import { useEffect, useRef } from "react";
import { initMesh } from "@/lib/mesh-gradient";

/**
 * The hero's animated backdrop.
 *
 * The scrim is not decoration, and its strength is a measured trade, not a
 * taste. A 65% wash did protect the text — and composited the near-white
 * palette to roughly nothing, so the effect it was protecting stopped being
 * visible at all. The answer was to fix both ends: deepen the palette to
 * #FF9B9B, cut the scrim to 25%, and move the hero's sub-headline off
 * --muted-foreground, which fails at 3.24:1 over the deepest pixel.
 *
 * Worst case now, against #FFB4B4: h1 11.38:1, the red accent 4.86:1, the
 * sub-headline 6.18:1. The scrim lives in this component rather than at the
 * call site so the canvas can never be used without it.
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
      <div className="absolute inset-0 bg-white/25" />
    </div>
  );
}
