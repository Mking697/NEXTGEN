/* ============================================================
   NEXT GEN AUTOMATION — Site behaviour
   ============================================================ */
(function (w, d) {
  "use strict";

  /* Reveal animations are opt-in: the CSS only hides [data-reveal] inside
     .js-reveal. If this script ever fails to load, content stays visible. */
  d.documentElement.classList.add("js-reveal");

  var CFG = w.NGA_CONFIG || {};
  var Store = w.NGA_Store;

  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  w.NGA_esc = esc;
  w.NGA_$ = $; w.NGA_$$ = $$;

  function reducedMotion() {
    return w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------- 1. Config sanity check (developer warning only) ---------- */
  function checkConfig() {
    var problems = [];
    var c = CFG.contact || {};
    if (!c.whatsapp || /^9?1?0{6,}$/.test(String(c.whatsapp).replace(/\D/g, ""))) {
      problems.push("contact.whatsapp is still a placeholder — every form submission and WhatsApp button goes nowhere");
    }
    if (!c.phone || /0{5,}/.test(String(c.phone))) {
      problems.push("contact.phone is still a placeholder and is printed on every page");
    }
    if (!(CFG.tracking || {}).metaPixelId) {
      problems.push("tracking.metaPixelId is empty — Meta Ads cannot track PageView or Lead events");
    }
    if (!(CFG.supabase || {}).url && (CFG.leadFallback || {}).mode === "whatsapp") {
      problems.push("no Supabase configured — leads are not stored anywhere, they only open WhatsApp");
    }
    if (problems.length) {
      console.warn(
        "%c[Next Gen Automation] Site is not launch-ready yet:\n" +
        problems.map(function (p, i) { return "  " + (i + 1) + ". " + p; }).join("\n") +
        "\n\nFix these in assets/js/config.js before running any paid campaign.",
        "color:#FBBF24;font-weight:bold"
      );
    }
  }

  /* ---------- 2. Tracking pixels ---------- */
  function initTracking() {
    var t = CFG.tracking || {};

    if (t.metaPixelId) {
      /* eslint-disable */
      !function(f,b,e,v,n,t2,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t2=b.createElement(e);t2.async=!0;
      t2.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t2,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      w.fbq("init", t.metaPixelId);
      w.fbq("track", "PageView");
    }

    var gid = t.ga4Id || t.googleAdsId;
    if (gid) {
      var s = d.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gid);
      d.head.appendChild(s);
      w.dataLayer = w.dataLayer || [];
      w.gtag = function () { w.dataLayer.push(arguments); };
      w.gtag("js", new Date());
      if (t.ga4Id) w.gtag("config", t.ga4Id);
      if (t.googleAdsId) w.gtag("config", t.googleAdsId);
    }
  }

  w.NGA_track = function (event, data) {
    try { if (w.fbq) w.fbq("track", event, data || {}); } catch (e) {}
    try { if (w.gtag) w.gtag("event", event, data || {}); } catch (e) {}
  };

  /* ---------- 3. Config-driven text & links ---------- */
  function deepGet(obj, path) {
    return path.split(".").reduce(function (o, k) { return o && o[k]; }, obj);
  }

  function waLink(text) {
    var n = (CFG.contact && CFG.contact.whatsapp) || "";
    var msg = text || ("Hi " + ((CFG.brand && CFG.brand.name) || "") +
      ", I would like to know more about your products and services.");
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(msg);
  }
  w.NGA_waLink = waLink;

  function applyConfig(scope) {
    $$("[data-cfg]", scope).forEach(function (el) {
      var v = deepGet(CFG, el.getAttribute("data-cfg"));
      if (v) el.textContent = v;
    });
    $$("[data-cfg-href]", scope).forEach(function (el) {
      var key = el.getAttribute("data-cfg-href");
      if (key === "whatsapp") el.href = waLink(el.getAttribute("data-wa-msg"));
      else if (key === "phone") el.href = "tel:" + String((CFG.contact && CFG.contact.phone) || "").replace(/\s/g, "");
      else if (key === "phone2") el.href = "tel:" + String((CFG.contact && CFG.contact.phone2) || "").replace(/\s/g, "");
      else if (key === "email") el.href = "mailto:" + ((CFG.contact && CFG.contact.email) || "");
      else {
        var v = deepGet(CFG, key);
        if (v) el.href = v; else el.classList.add("hidden");
      }
    });
    $$("[data-year]", scope).forEach(function (el) { el.textContent = new Date().getFullYear(); });
    $$("[data-brand]", scope).forEach(function (el) { el.textContent = (CFG.brand && CFG.brand.name) || ""; });
  }
  w.NGA_applyConfig = applyConfig;

  /* ---------- 4. Navigation ---------- */
  function initNav() {
    var nav = $(".nav");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("scrolled", w.scrollY > 12); };
      onScroll();
      w.addEventListener("scroll", onScroll, { passive: true });
    }

    var burger = $(".burger"), links = $(".nav-links");
    if (burger && links) {
      var closeMenu = function (refocus) {
        links.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        if (refocus) burger.focus();
      };

      burger.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        burger.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) {
          var first = links.querySelector("a");
          if (first) setTimeout(function () { first.focus(); }, 60);
        }
      });

      links.addEventListener("click", function (e) {
        if (e.target.tagName === "A") closeMenu(false);
      });

      d.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && links.classList.contains("open")) closeMenu(true);
      });
    }

    var here = location.pathname.split("/").pop() || "index.html";
    $$(".nav-links a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("#")[0];
      if (href && href === here) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- 5. Reveal on scroll ---------- */
  function initReveal() {
    var els = $$("[data-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in w)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var delay = parseInt(en.target.getAttribute("data-reveal") || "0", 10);
          setTimeout(function () { en.target.classList.add("in"); }, delay);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 6. Counters ---------- */
  function initCounters() {
    var els = $$("[data-count]");
    if (!els.length || !("IntersectionObserver" in w)) return;

    if (reducedMotion()) {
      els.forEach(function (e) { e.textContent = e.getAttribute("data-count"); });
      return;
    }

    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var raw = en.target.getAttribute("data-count");
        var num = parseFloat(raw);
        if (isNaN(num)) return;
        var suffix = raw.replace(/^[\d.]+/, "");
        var t0 = performance.now(), dur = 1200;
        (function tick(t) {
          var p = Math.min((t - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          en.target.textContent = Math.round(num * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.5 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 7. Lead forms ---------- */
  function initForms() {
    $$("form[data-lead-form]").forEach(function (form) {
      var okBox = $("[data-alert-ok]", form);
      var errBox = $("[data-alert-err]", form);
      var btn = $("button[type=submit]", form);
      var label = btn ? btn.innerHTML : "";

      if (errBox && !errBox.id) errBox.id = "form-err-" + Math.random().toString(36).slice(2, 8);

      function clearMsg() {
        [okBox, errBox].forEach(function (b) {
          if (b) { b.classList.remove("show"); b.textContent = ""; }
        });
        $$("[aria-invalid]", form).forEach(function (el) {
          el.removeAttribute("aria-invalid");
          el.removeAttribute("aria-describedby");
        });
      }

      /* The live region must already be rendered when its text changes,
         otherwise screen readers never announce it. */
      function say(msg, ok, field) {
        var box = ok ? okBox : errBox;
        if (!box) { w.alert(msg); return; }
        clearMsg();
        box.classList.add("show");
        requestAnimationFrame(function () { box.textContent = msg; });
        if (!ok && field) {
          field.setAttribute("aria-invalid", "true");
          field.setAttribute("aria-describedby", errBox.id);
          field.focus();
        }
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        clearMsg();

        var fd = new FormData(form);
        var lead = {
          name: (fd.get("name") || "").toString().trim(),
          phone: (fd.get("phone") || "").toString().trim(),
          email: (fd.get("email") || "").toString().trim(),
          product: (fd.get("product") || "").toString().trim(),
          message: (fd.get("message") || "").toString().trim()
        };

        if (fd.get("company")) return; // honeypot

        if (lead.name.length < 2) {
          return say("Please enter your name.", false, form.elements.name);
        }
        if (!/^[+\d][\d\s-]{7,17}$/.test(lead.phone)) {
          return say("Please enter a valid phone number (10 digits).", false, form.elements.phone);
        }
        if (lead.email && !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(lead.email)) {
          return say("That email address does not look right.", false, form.elements.email);
        }

        if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }

        Store.submitLead(lead).then(function (r) {
          w.NGA_track("Lead", { content_name: lead.product || "General Enquiry" });
          form.reset();
          if (r && r.via === "whatsapp") {
            say("WhatsApp is opening in a new tab — just press send.", true);
          } else if (r && r.via === "mailto") {
            say("Your email app is opening — just press send.", true);
          } else {
            say("Thank you! We have your enquiry and will contact you within 24 hours.", true);
          }
        }).catch(function (err) {
          console.error(err);
          say("Something went wrong. Please message us on WhatsApp instead: " +
              ((CFG.contact && CFG.contact.phone) || ""), false);
        }).then(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = label; }
        });
      });
    });
  }

  /* ---------- 8. Product/service dropdown ---------- */
  function initProductSelects() {
    var sels = $$("select[data-products-select]");
    if (!sels.length || !Store) return;

    Promise.all([Store.getProducts(), Store.getServices()]).then(function (res) {
      var products = res[0] || [], services = res[1] || [];
      var pre = new URLSearchParams(location.search).get("product") || "";

      sels.forEach(function (sel) {
        function addGroup(title, list) {
          if (!list.length) return;
          var g = d.createElement("optgroup");
          g.label = title;
          list.forEach(function (p) {
            var o = d.createElement("option");
            o.value = p.name; o.textContent = p.name;
            if (pre && (p.slug === pre || p.name === pre)) o.selected = true;
            g.appendChild(o);
          });
          sel.appendChild(g);
        }
        addGroup("Products", products);
        addGroup("Services", services);

        var other = d.createElement("option");
        other.value = "Not sure";
        other.textContent = "Not sure — please advise";
        sel.appendChild(other);
      });
    });
  }

  /* ---------- 9. Contact click tracking ---------- */
  function initCtaTracking() {
    d.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href^='https://wa.me'],a[href^='tel:']");
      if (a) w.NGA_track("Contact", { method: a.href.indexOf("wa.me") > -1 ? "whatsapp" : "phone" });
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    checkConfig();
    initTracking();
    applyConfig();
    initNav();
    initReveal();
    initCounters();
    initForms();
    initProductSelects();
    initCtaTracking();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
