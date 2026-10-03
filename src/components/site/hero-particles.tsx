"use client";

import { useEffect, useRef } from "react";

/**
 * A faint cluster of brand-red dots behind the hero's proof card, easing
 * toward the pointer. Adapted from 21st.dev's "Animated Hero" particle grid
 * (ravikatiyar162/animated-hero) — the cursor-follow idea, not its dark
 * full-bleed theme, since this page's hero is white/red and already carries
 * the mesh-gradient canvas and the proof card as its real content.
 *
 * Respects reduced-motion (renders nothing) and skips entirely with no
 * pointer events (CSS handles the drift via `transition`, not rAF), so it
 * costs nothing beyond a few DOM nodes and one listener.
 */
export function HeroParticles({ count = 18 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const dots = Array.from(el.children) as HTMLElement[];

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      dots.forEach((dot, i) => {
        const strength = 1 - i / dots.length;
        dot.style.setProperty("--px", `${cx * 26 * strength}px`);
        dot.style.setProperty("--py", `${cy * 26 * strength}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const dots = Array.from({ length: count });

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        return (
          <span
            key={i}
            className="hero-particle size-1.5"
            style={{
              left: `${8 + col * 16}%`,
              top: `${10 + row * 22}%`,
              opacity: 0.16 - row * 0.02,
            }}
          />
        );
      })}
    </div>
  );
}
