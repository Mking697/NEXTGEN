"use client";

import { useEffect, useRef } from "react";

/**
 * The reading-progress bar at the top of the page.
 *
 * Where the browser supports animation-timeline: scroll(), the CSS drives this
 * entirely and this component only renders the element — no scroll listener at
 * all. The JS path exists solely for browsers without it, and is rAF-throttled
 * so it cannot fire a layout read per scroll event.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (CSS.supports?.("animation-timeline", "scroll()")) return;

    const bar = ref.current;
    if (!bar) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
