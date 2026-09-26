"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal, with two implementations and a preference between them.
 *
 * Where the browser has scroll-driven timelines, the whole thing is handed to
 * CSS by stamping data-reveal: it runs on the compositor, is tied to scroll
 * position rather than to a one-shot threshold, and so plays back when the
 * visitor scrolls up again. The IntersectionObserver path is the fallback.
 *
 * It starts visible either way and only hides once one of the two is actually
 * armed, so a failed hydration leaves readable content rather than a blank
 * column — and reduced-motion skips both.
 *
 * `delay` applies to the JS path only. Under view() each element is timed by
 * its own position, so a row already arrives together and a delay would just
 * desynchronise it.
 */
export function Reveal({
  children, delay = 0, className,
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"off" | "css" | "js">("off");
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (CSS.supports?.("animation-timeline", "view()")) {
      setMode("css");
      return;
    }
    if (!("IntersectionObserver" in window)) return;

    const el = ref.current;
    if (!el) return;

    setMode("js");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      data-reveal={mode === "css" ? "" : undefined}
      className={cn(
        mode === "js" && "transition-[opacity,transform] duration-700 ease-out",
        mode === "js" && !shown && "translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
