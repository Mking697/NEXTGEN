"use client";

import { useEffect, useRef } from "react";

/**
 * The logo build animation, pinned while it scrolls past.
 *
 * The source video is a logo build on a PURE WHITE background, so it sits on
 * a light section with mix-blend-mode:multiply — the white drops out and the
 * mark appears to draw itself onto the page, with no visible video box.
 *
 * It is preload="none" and only load()s once on screen: this audience is on
 * mobile data. It plays once per entry rather than looping, which keeps it
 * outside WCAG 2.2.2 (moving content over five seconds).
 */
export function BrandMoment() {
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = vidRef.current;
    if (!v || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) { if (!v.paused) v.pause(); return; }
      if (v.dataset.loaded !== "1") { v.dataset.loaded = "1"; v.load(); }
      v.play().catch(() => { /* autoplay blocked — the poster stands in */ });
    }, { threshold: 0.25 });

    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="brand-moment-heading" className="relative overflow-clip bg-background">
      <div className="relative min-h-[112vh] md:min-h-[180vh]">
        <div className="sticky top-0 grid h-screen place-items-center px-5 text-center">
          <div>
            <div className="relative mx-auto grid aspect-square w-[min(62vmin,300px)] place-items-center md:w-[min(58vmin,420px)]">
              <span
                aria-hidden="true"
                className="absolute -inset-[14%] -z-10 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(248,0,0,.09), transparent 70%)" }}
              />
              <video
                ref={vidRef}
                muted
                playsInline
                preload="none"
                poster="/video/logo-anim-poster.jpg"
                aria-label="The Essor Automations logo assembling"
                className="size-full object-contain mix-blend-multiply"
              >
                <source src="/video/logo-anim.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="mx-auto mt-7 max-w-[640px]">
              <h2 id="brand-moment-heading" className="mb-2 text-[clamp(1.5rem,3.4vw,2.3rem)] font-extrabold">
                Built by one team, start to finish
              </h2>
              <p className="text-[clamp(1rem,1.3vw,1.125rem)] text-muted-foreground">
                We write the code, run the servers, and answer the phone. No reselling,
                no white-labelling, no handing you to someone else when it breaks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
