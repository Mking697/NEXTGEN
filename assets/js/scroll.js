/* ============================================================
   ESSOR AUTOMATIONS — Scroll experience
   ------------------------------------------------------------
   CSS does the scroll-linked animation wherever the browser supports
   scroll-driven timelines. This file only:
     1. supplies a fallback progress bar where it does not,
     2. plays the brand video only while it is on screen,
     3. marks process steps as they come into view.
   Nothing here is required for the page to be readable.
   ============================================================ */
(function (w, d) {
  "use strict";

  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

  var reduced = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasScrollTimeline = CSS.supports && CSS.supports("animation-timeline", "scroll()");
  var hasViewTimeline = CSS.supports && CSS.supports("animation-timeline", "view()");

  /* ---------- 1. Progress bar ---------- */
  function initProgress() {
    if (reduced) return;
    var bar = $(".scroll-progress");
    if (!bar) {
      bar = d.createElement("div");
      bar.className = "scroll-progress";
      bar.setAttribute("aria-hidden", "true");
      d.body.insertBefore(bar, d.body.firstChild);
    }
    // The CSS handles this natively where scroll() exists; only drive it by
    // hand where it does not, so we are not fighting the compositor.
    if (hasScrollTimeline) return;

    var ticking = false;
    function update() {
      var h = d.documentElement.scrollHeight - w.innerHeight;
      var p = h > 0 ? Math.min(w.scrollY / h, 1) : 0;
      bar.style.transform = "scaleX(" + p + ")";
      ticking = false;
    }
    w.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    w.addEventListener("resize", update, { passive: true });
    update();
  }

  /* ---------- 2. Brand video ---------- */
  /* Autoplay is left off deliberately: this audience is on mobile data, so
     the file is only fetched and played once it is actually on screen. */
  function initVideo() {
    var vids = $$("video[data-inview-play]");
    if (!vids.length) return;

    if (!("IntersectionObserver" in w)) {
      vids.forEach(function (v) { v.setAttribute("preload", "metadata"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (v.dataset.loaded !== "1") {
            v.dataset.loaded = "1";
            v.load();
          }
          var p = v.play();
          if (p && p.catch) p.catch(function () { /* autoplay blocked — poster stands in */ });
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.25 });

    vids.forEach(function (v) { io.observe(v); });
  }

  /* ---------- 3. Process rail ---------- */
  function initRail() {
    var steps = $$(".rail-step");
    if (!steps.length) return;
    if (!("IntersectionObserver" in w)) {
      steps.forEach(function (s) { s.classList.add("in-view"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        en.target.classList.toggle("in-view", en.isIntersecting);
      });
    }, { threshold: 0.45, rootMargin: "-10% 0px -25% 0px" });
    steps.forEach(function (s) { io.observe(s); });
  }

  /* ---------- 4. Report capability (dev only) ---------- */
  function report() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      console.info(
        "[Essor] scroll-driven CSS: timeline " + (hasScrollTimeline ? "yes" : "no") +
        ", view() " + (hasViewTimeline ? "yes" : "no") +
        (reduced ? " (reduced-motion on)" : "")
      );
    }
  }

  function boot() { initProgress(); initVideo(); initRail(); report(); }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
