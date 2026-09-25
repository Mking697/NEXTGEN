"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up once on entry. Reduced motion gets the final value immediately. */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const num = parseFloat(value);
  const suffix = value.replace(/^[\d.,]+/, "");
  const [n, setN] = useState<string>(Number.isNaN(num) ? value : "0");

  useEffect(() => {
    if (Number.isNaN(num)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(String(num));
      return;
    }
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setN(String(num)); return; }

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const t0 = performance.now(), dur = 1100;
      const tick = (t: number) => {
        const p = Math.min((t - t0) / dur, 1);
        setN(String(Math.round(num * (1 - Math.pow(1 - p, 3)))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });

    io.observe(el);
    return () => io.disconnect();
  }, [num]);

  return <span ref={ref} className={className}>{n}{suffix}</span>;
}
