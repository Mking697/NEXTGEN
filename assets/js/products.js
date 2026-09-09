/* ============================================================
   NEXT GEN AUTOMATION — Catalog rendering
   Renders both collections:
     products -> [data-product-grid] / [data-product-detail]
     services -> [data-service-grid] / [data-service-detail]
   ============================================================ */
(function (w, d) {
  "use strict";
  var Store = w.NGA_Store, esc = w.NGA_esc;
  var $ = w.NGA_$, $$ = w.NGA_$$;
  var CFG = w.NGA_CONFIG || {};

  var STATUS = {
    live: { cls: "badge-live", txt: "Live" },
    beta: { cls: "badge-beta", txt: "Beta" },
    soon: { cls: "badge-soon", txt: "Coming Soon" }
  };

  function statusOf(p) { return STATUS[p.status] || STATUS.live; }

  function listOf(v) {
    if (Array.isArray(v)) return v;
    return String(v || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function grad(p) {
    return "linear-gradient(135deg," + (p.color_from || "#5B7CFF") + "," + (p.color_to || "#22D3EE") + ")";
  }

  function priceBlock(p) {
    if (p.price) {
      return '<div class="p-price"><b>' + esc(p.price) + "</b>" +
        (p.old_price ? "<s>" + esc(p.old_price) + "</s>" : "") +
        (p.price_note ? " <span>" + esc(p.price_note) + "</span>" : "") + "</div>";
    }
    return '<div class="p-price"><span>' + esc(p.price_note || "Pricing on request") + "</span></div>";
  }

  function paint(el) { if (w.NGA_paintIcons) w.NGA_paintIcons(el); }

  function domainOf(url) {
    return String(url || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  }

  /* A live, openable domain is stronger proof than a "pricing on request" row. */
  function proofOrPrice(p) {
    if (p.status === "live" && p.url) {
      return '<div class="p-proof"><span class="dot live"></span>' +
        '<span><b>' + esc(domainOf(p.url)) + "</b> &middot; live now</span></div>";
    }
    return '<div class="p-price"><span>' + esc(p.price_note || "Pricing on request") + "</span></div>";
  }

  /* ============================================================
     PRODUCT CARD
     ============================================================ */
  function productCard(p, i) {
    var s = statusOf(p);
    var f = listOf(p.features).slice(0, 4);
    var isLive = p.status === "live" && p.url;

    return '' +
      '<article class="p-card" data-reveal="' + ((i % 3) * 80) + '" data-cat="' + esc(p.category || "") + '">' +
        '<div class="p-top">' +
          '<div class="p-logo" style="background:' + grad(p) + '">' +
            esc(p.logo_text || (p.name || "?").slice(0, 2).toUpperCase()) + "</div>" +
          '<div class="p-title">' +
            "<h3>" + esc(p.name) + "</h3>" +
            '<div class="p-cat">' + esc(p.category || "Software") + "</div>" +
          "</div>" +
          '<span class="badge ' + s.cls + '">' +
            (p.status === "live" ? '<span class="dot live"></span>' : "") + s.txt + "</span>" +
        "</div>" +
        '<div class="p-body">' +
          "<p>" + esc(p.description || p.tagline || "") + "</p>" +
          (f.length ? '<ul class="p-feats">' + f.map(function (x) {
            return "<li>" + esc(x) + "</li>";
          }).join("") + "</ul>" : "") +
        "</div>" +
        proofOrPrice(p) +
        '<div class="p-foot">' +
          '<a class="btn btn-wa btn-sm" href="' +
            w.NGA_waLink("Hi, I would like a demo of " + p.name + ".") +
            '" target="_blank" rel="noopener">Get a demo</a>' +
          '<a class="btn btn-ghost btn-sm" href="product.html?slug=' + encodeURIComponent(p.slug) + '">Details</a>' +
        "</div>" +
        (isLive
          ? '<a class="p-visit" href="' + esc(p.url) + '" target="_blank" rel="noopener">Open ' +
            esc(domainOf(p.url)) + " &#8599;</a>"
          : '<a class="p-visit" href="contact.html?product=' + encodeURIComponent(p.slug) +
            '">Join the early access list &#8594;</a>') +
      "</article>";
  }

  /* ============================================================
     SERVICE CARD
     ============================================================ */
  function serviceCard(sv, i) {
    var items = listOf(sv.deliverables).slice(0, 4);

    return '' +
      '<article class="s-card" data-reveal="' + ((i % 3) * 80) + '" data-cat="' + esc(sv.category || "") + '">' +
        '<span class="s-stripe" style="background:' + grad(sv) + '" aria-hidden="true"></span>' +
        '<div class="s-head">' +
          '<span class="s-ico" data-icon="' + esc(sv.icon || "zap") + '" ' +
            'style="background:' + grad(sv) + '"></span>' +
          "<div>" +
            '<div class="p-cat">' + esc(sv.category || "Service") + "</div>" +
            "<h3>" + esc(sv.name) + "</h3>" +
          "</div>" +
        "</div>" +
        '<p class="s-tagline">' + esc(sv.tagline || "") + "</p>" +
        "<p>" + esc(sv.description || "") + "</p>" +
        (items.length ? '<ul class="s-list">' + items.map(function (x) {
          return "<li>" + esc(x) + "</li>";
        }).join("") + "</ul>" : "") +
        '<div class="s-foot">' +
          '<a class="btn btn-ghost btn-sm" href="service.html?slug=' + encodeURIComponent(sv.slug) + '">What&#8217;s included</a>' +
          '<a class="btn btn-primary btn-sm" href="contact.html?product=' + encodeURIComponent(sv.slug) + '">Get a Quote</a>' +
        "</div>" +
      "</article>";
  }

  /* ============================================================
     GRIDS
     ============================================================ */
  function renderGrid(sel, kind, cardFn) {
    var grid = $(sel);
    if (!grid) return;

    var limit = parseInt(grid.getAttribute("data-limit") || "0", 10);
    var onlyFeatured = grid.hasAttribute("data-featured");

    Store.getItems(kind).then(function (list) {
      if (onlyFeatured) {
        var f = list.filter(function (p) { return p.featured; });
        if (f.length) list = f;
      }
      if (limit > 0) list = list.slice(0, limit);

      if (!list.length) {
        grid.innerHTML = '<div class="empty">Nothing published here yet.</div>';
        grid.removeAttribute("aria-busy");
        return;
      }

      grid.innerHTML = list.map(cardFn).join("");
      grid.removeAttribute("aria-busy");
      buildFilters(grid, list);
      paint(grid);
      revive(grid);
    }).catch(function (e) {
      console.error(e);
      grid.innerHTML = '<div class="empty">Could not load. Please refresh the page.</div>';
      grid.removeAttribute("aria-busy");
    });
  }

  function buildFilters(grid, list) {
    var box = $("[data-filters][data-for='" + grid.getAttribute("data-kind") + "']") || $("[data-filters]");
    if (!box || box.getAttribute("data-built")) return;

    var cats = [];
    list.forEach(function (p) { if (p.category && cats.indexOf(p.category) < 0) cats.push(p.category); });
    if (cats.length < 2) return;

    box.setAttribute("data-built", "1");
    box.innerHTML = '<button class="chip active" data-f="all">' +
      (box.getAttribute("data-all-label") || "Everything") + "</button>" +
      cats.map(function (c) { return '<button class="chip" data-f="' + esc(c) + '">' + esc(c) + "</button>"; }).join("");

    box.addEventListener("click", function (e) {
      var b = e.target.closest("button.chip");
      if (!b) return;
      $$(".chip", box).forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      var f = b.getAttribute("data-f");
      $$("[data-cat]", grid).forEach(function (card) {
        card.classList.toggle("hidden", !(f === "all" || card.getAttribute("data-cat") === f));
      });
    });
  }

  function revive(scope) {
    $$("[data-reveal]", scope).forEach(function (el, i) {
      setTimeout(function () { el.classList.add("in"); }, 60 + i * 60);
    });
  }

  /* ============================================================
     PRODUCT DETAIL
     ============================================================ */
  function renderProductDetail() {
    var host = $("[data-product-detail]");
    if (!host) return;
    var slug = new URLSearchParams(location.search).get("slug");
    if (!slug) { host.removeAttribute("aria-busy"); host.innerHTML = notFound("product"); return; }

    Store.getProduct(slug).then(function (p) {
      if (!p || p.published === false) { host.removeAttribute("aria-busy"); host.innerHTML = notFound("product"); return; }

      var s = statusOf(p);
      var f = listOf(p.features);
      var hi = listOf(p.highlights);
      var isLive = p.status === "live" && p.url;

      setMeta(p.name + " — " + (p.tagline || "") , p.description);

      host.innerHTML =
        '<section class="section" style="padding-top:56px"><div class="wrap">' +
          crumb([["index.html", "Home"], ["products.html", "Products"]], p.name) +
          '<div class="split" style="align-items:flex-start">' +

            "<div>" +
              '<div style="display:flex;align-items:center;gap:16px;margin-bottom:22px">' +
                '<div class="p-logo" style="width:66px;height:66px;font-size:1.5rem;background:' + grad(p) + '">' +
                  esc(p.logo_text || p.name.slice(0, 2).toUpperCase()) + "</div>" +
                "<div>" +
                  '<span class="badge ' + s.cls + '">' +
                    (p.status === "live" ? '<span class="dot live"></span>' : "") + s.txt + "</span>" +
                  '<div class="p-cat" style="margin-top:6px">' + esc(p.category || "") + "</div>" +
                "</div>" +
              "</div>" +
              "<h1>" + esc(p.name) + "</h1>" +
              '<p class="lead" style="margin-bottom:12px"><strong style="color:var(--text)">' +
                esc(p.tagline || "") + "</strong></p>" +
              '<p class="lead">' + esc(p.long_description || p.description || "") + "</p>" +
              (hi.length ? '<ul class="check-list" style="margin:26px 0">' + hi.map(function (x) {
                return "<li><span>" + esc(x) + "</span></li>";
              }).join("") + "</ul>" : "") +
              '<div class="btn-row" style="margin-top:28px">' +
                '<a class="btn btn-primary btn-lg" href="contact.html?product=' + encodeURIComponent(p.slug) + '">' +
                  (isLive ? "Book a Free Demo" : "Request Early Access") + "</a>" +
                (isLive ? '<a class="btn btn-ghost btn-lg" href="' + esc(p.url) +
                  '" target="_blank" rel="noopener">Visit Live Site &#8599;</a>' : "") +
                '<a class="btn btn-wa btn-lg" href="' +
                  w.NGA_waLink("Hi, I would like to know more about " + p.name + ".") +
                  '" target="_blank" rel="noopener">WhatsApp</a>' +
              "</div>" +
            "</div>" +

            "<div><div class=\"form-card\">" +
              '<h2 style="font-size:1.2rem;margin-bottom:18px">What you get</h2>' +
              (f.length
                ? '<ul class="check-list">' + f.map(function (x) { return "<li><b>" + esc(x) + "</b></li>"; }).join("") + "</ul>"
                : '<p class="lead">Feature list coming soon.</p>') +
              '<div style="border-top:1px solid var(--line);margin-top:22px;padding-top:22px">' +
                priceBlock(p).replace('class="p-price"', 'class="p-price" style="padding:0"') +
                '<a class="btn btn-primary btn-block" style="margin-top:16px" href="contact.html?product=' +
                  encodeURIComponent(p.slug) + '">Request a Quote</a>' +
              "</div>" +
            "</div></div>" +

          "</div></div></section>" +
          relatedSection("More Products", "data-related");

      host.removeAttribute("aria-busy");
      paint(host);
      fillRelated("products", p.slug, productCard);
    }).catch(function (e) { console.error(e); host.innerHTML = notFound("product"); });
  }

  /* ============================================================
     SERVICE DETAIL
     ============================================================ */
  function renderServiceDetail() {
    var host = $("[data-service-detail]");
    if (!host) return;
    var slug = new URLSearchParams(location.search).get("slug");
    if (!slug) { host.removeAttribute("aria-busy"); host.innerHTML = notFound("service"); return; }

    Store.getService(slug).then(function (sv) {
      if (!sv || sv.published === false) { host.removeAttribute("aria-busy"); host.innerHTML = notFound("service"); return; }

      var items = listOf(sv.deliverables);
      var out = listOf(sv.outcomes);

      setMeta(sv.name + " — " + (sv.tagline || ""), sv.description);

      host.innerHTML =
        '<section class="section" style="padding-top:56px"><div class="wrap">' +
          crumb([["index.html", "Home"], ["services.html", "Services"]], sv.name) +
          '<div class="split" style="align-items:flex-start">' +

            "<div>" +
              '<div style="display:flex;align-items:center;gap:16px;margin-bottom:22px">' +
                '<span class="s-ico" data-icon="' + esc(sv.icon || "zap") +
                  '" style="width:64px;height:64px;background:' + grad(sv) + '"></span>' +
                '<div class="p-cat">' + esc(sv.category || "Service") + "</div>" +
              "</div>" +
              "<h1>" + esc(sv.name) + "</h1>" +
              '<p class="lead" style="margin-bottom:12px"><strong style="color:var(--text)">' +
                esc(sv.tagline || "") + "</strong></p>" +
              '<p class="lead">' + esc(sv.long_description || sv.description || "") + "</p>" +
              (out.length ? '<h2 style="font-size:1.15rem;margin-top:32px">What changes for you</h2>' +
                '<ul class="check-list">' + out.map(function (x) {
                  return "<li><span>" + esc(x) + "</span></li>";
                }).join("") + "</ul>" : "") +
              '<div class="btn-row" style="margin-top:30px">' +
                '<a class="btn btn-primary btn-lg" href="contact.html?product=' + encodeURIComponent(sv.slug) + '">Get a Free Quote</a>' +
                '<a class="btn btn-wa btn-lg" href="' +
                  w.NGA_waLink("Hi, I am interested in your " + sv.name + " service.") +
                  '" target="_blank" rel="noopener">WhatsApp</a>' +
              "</div>" +
            "</div>" +

            "<div><div class=\"form-card\">" +
              '<h2 style="font-size:1.2rem;margin-bottom:18px">What is included</h2>' +
              (items.length
                ? '<ul class="check-list">' + items.map(function (x) { return "<li><b>" + esc(x) + "</b></li>"; }).join("") + "</ul>"
                : '<p class="lead">Scope is defined after the first call.</p>') +
              '<div style="border-top:1px solid var(--line);margin-top:22px;padding-top:22px">' +
                priceBlock(sv).replace('class="p-price"', 'class="p-price" style="padding:0"') +
                '<a class="btn btn-primary btn-block" style="margin-top:16px" href="contact.html?product=' +
                  encodeURIComponent(sv.slug) + '">Talk to Us</a>' +
              "</div>" +
            "</div></div>" +

          "</div></div></section>" +
          relatedSection("Other Services", "data-related-services");

      host.removeAttribute("aria-busy");
      paint(host);
      fillRelated("services", sv.slug, serviceCard);
    }).catch(function (e) { console.error(e); host.innerHTML = notFound("service"); });
  }

  /* ---------- shared detail helpers ---------- */
  function crumb(links, current) {
    return '<nav class="crumb" aria-label="Breadcrumb"><ol>' +
      links.map(function (l) {
        return '<li><a href="' + l[0] + '">' + esc(l[1]) + "</a></li>";
      }).join('<li aria-hidden="true">/</li>') +
      '<li aria-hidden="true">/</li><li aria-current="page">' + esc(current) + "</li>" +
      "</ol></nav>";
  }

  function setMeta(title, desc) {
    d.title = title + " | " + ((CFG.brand && CFG.brand.name) || "");
    var md = d.querySelector('meta[name="description"]');
    if (md && desc) md.setAttribute("content", String(desc).slice(0, 158));
  }

  function relatedSection(heading, attr) {
    return '<section class="section" style="padding-top:0"><div class="wrap">' +
      '<div class="section-head center"><h2>' + heading + "</h2></div>" +
      '<div class="' + (attr === "data-related" ? "p-grid" : "s-grid") + '" ' + attr + "></div>" +
      "</div></section>";
  }

  function fillRelated(kind, currentSlug, cardFn) {
    var host = $(kind === "products" ? "[data-related]" : "[data-related-services]");
    if (!host) return;
    Store.getItems(kind).then(function (all) {
      var rel = all.filter(function (x) { return x.slug !== currentSlug; }).slice(0, 3);
      if (!rel.length) { host.parentNode.parentNode.remove(); return; }
      host.innerHTML = rel.map(cardFn).join("");
      paint(host);
      revive(host);
    });
  }

  function notFound(kind) {
    var back = kind === "service" ? "services.html" : "products.html";
    return '<section class="section"><div class="wrap center">' +
      "<h1>Not found</h1>" +
      '<p class="lead">This ' + kind + ' has been removed, or the link is incorrect.</p>' +
      '<div class="btn-row"><a class="btn btn-primary" href="' + back + '">Browse all ' + kind + "s</a></div>" +
      "</div></section>";
  }

  /* ---------- boot ---------- */
  function boot() {
    renderGrid("[data-product-grid]", "products", productCard);
    renderGrid("[data-service-grid]", "services", serviceCard);
    renderProductDetail();
    renderServiceDetail();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
