"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal. Starts visible and only hides once the observer is actually
 * attached, so a failed hydration leaves readable content rather than a blank
 * column — and reduced-motion skips the whole thing.
 */
export function Reveal({
  children, delay = 0, className,
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const el = ref.current;
    if (!el) return;

    setArmed(true);
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
      className={cn(
        armed && "transition-[opacity,transform] duration-700 ease-out",
        armed && !shown && "translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
