/* ============================================================
   NEXT GEN AUTOMATION — Shared Nav + Footer
   Edit here once, and it applies across the whole site.
   Usage: put <div data-nav></div> and <div data-footer></div> in a page.
   ============================================================ */
(function (w, d) {
  "use strict";

  /* Root prefix from the current URL depth:
     /index.html -> ""   |   /admin/x.html -> "../"   |   /a/b/c -> "../../" */
  var depth = location.pathname.split("/").filter(Boolean).length - 1;
  var R = depth > 0 ? new Array(depth + 1).join("../") : "";

  var NAV =
  '<header class="nav">' +
    '<div class="wrap">' +
      '<a class="logo" href="' + R + 'index.html" aria-label="NextGen Business Automation home">' +
        '<img class="logo-img" src="' + R + 'assets/img/icon-mark.png" alt="" width="64" height="40" decoding="async">' +
        '<span>NextGen<small>Business Automation</small></span>' +
      '</a>' +
      '<nav class="nav-links" id="navlinks" aria-label="Main">' +
        '<a href="' + R + 'index.html">Home</a>' +
        '<a href="' + R + 'products.html">Products</a>' +
        '<a href="' + R + 'services.html">Services</a>' +
        '<a href="' + R + 'index.html#why">Why Us</a>' +
        '<a href="' + R + 'about.html">About</a>' +
        '<a href="' + R + 'contact.html">Contact</a>' +
      '</nav>' +
      '<div class="nav-cta">' +
        '<a class="btn btn-ghost btn-sm" data-cfg-href="whatsapp" href="#" target="_blank" rel="noopener">WhatsApp</a>' +
        '<a class="btn btn-primary btn-sm nav-cta-keep" href="' + R + 'contact.html">Free Demo</a>' +
        '<button class="burger" aria-label="Menu" aria-controls="navlinks" aria-expanded="false"><span></span></button>' +
      '</div>' +
    '</div>' +
  '</header>';

  /* The <a> already carries the accessible name, so the icon is decorative. */
  function ico(path) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + path + '"/></svg>';
  }

  var WA_PATH = "M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.2 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.3.1.4.1.6-.1l.9-1c.2-.2.4-.2.6-.1l2.1 1c.3.1.4.2.5.3.1.2.1.7-.1 1.3Z";

  var FOOTER =
  '<footer class="footer">' +
    '<div class="wrap">' +
      '<div class="footer-grid">' +

        '<div class="footer-brand">' +
          '<a class="logo" href="' + R + 'index.html">' +
            '<img class="logo-img" src="' + R + 'assets/img/icon-mark.png" alt="" width="64" height="40" decoding="async">' +
            '<span>NextGen<small>Business Automation</small></span>' +
          '</a>' +
          '<p>Business software built, deployed and maintained in-house &mdash; plus the marketing team that fills it with customers.</p>' +
          '<div class="socials">' +
            '<a data-cfg-href="social.facebook" href="#" aria-label="Facebook" target="_blank" rel="noopener">' +
              ico("M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z") + '</a>' +
            '<a data-cfg-href="social.instagram" href="#" aria-label="Instagram" target="_blank" rel="noopener">' +
              ico("M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 5.3a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm5.7-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z") + '</a>' +
            '<a data-cfg-href="social.linkedin" href="#" aria-label="LinkedIn" target="_blank" rel="noopener">' +
              ico("M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21h-4V9Z") + '</a>' +
            '<a data-cfg-href="social.youtube" href="#" aria-label="YouTube" target="_blank" rel="noopener">' +
              ico("M23 12s0-3.4-.4-5c-.3-.9-1-1.6-1.9-1.9C19 4.7 12 4.7 12 4.7s-7 0-8.7.4c-.9.3-1.6 1-1.9 1.9C1 8.6 1 12 1 12s0 3.4.4 5c.3.9 1 1.6 1.9 1.9 1.7.4 8.7.4 8.7.4s7 0 8.7-.4c.9-.3 1.6-1 1.9-1.9.4-1.6.4-5 .4-5ZM9.8 15.3V8.7l5.8 3.3-5.8 3.3Z") + '</a>' +
            '<a data-cfg-href="social.twitter" href="#" aria-label="X" target="_blank" rel="noopener">' +
              ico("M17.7 3h3.3l-7.2 8.2L22 21h-6.5l-5.1-6.3L4.6 21H1.3l7.7-8.8L2 3h6.6l4.6 5.8L17.7 3Zm-1.2 16h1.8L7.6 4.8H5.7L16.5 19Z") + '</a>' +
          '</div>' +
        '</div>' +

        '<div>' +
          '<h4>Products</h4>' +
          '<ul data-footer-products>' +
            '<li><a href="' + R + 'products.html">All Products</a></li>' +
          '</ul>' +
        '</div>' +

        '<div>' +
          '<h4>Services</h4>' +
          '<ul data-footer-services>' +
            '<li><a href="' + R + 'services.html">All Services</a></li>' +
          '</ul>' +
        '</div>' +

        '<div>' +
          '<h4>Company</h4>' +
          '<ul>' +
            '<li><a href="' + R + 'about.html">About Us</a></li>' +
            '<li><a href="' + R + 'index.html#why">Why Next Gen</a></li>' +
            '<li><a href="' + R + 'index.html#how">How It Works</a></li>' +
            '<li><a href="' + R + 'index.html#faq">FAQ</a></li>' +
            '<li><a href="' + R + 'contact.html">Contact</a></li>' +
          '</ul>' +
        '</div>' +

        '<div>' +
          '<h4>Get in Touch</h4>' +
          '<address>' +
            '<a data-cfg-href="phone" href="#"><span data-cfg="contact.phone"></span></a><br>' +
            '<a data-cfg-href="phone2" href="#"><span data-cfg="contact.phone2"></span></a><br>' +
            '<a data-cfg-href="email" href="#"><span data-cfg="contact.email"></span></a><br>' +
            '<span data-cfg="contact.address"></span><br>' +
            '<span style="color:var(--text-faint);font-size:.85rem" data-cfg="contact.hours"></span>' +
          '</address>' +
        '</div>' +

      '</div>' +

      '<div class="footer-bot">' +
        '<span>&copy; <span data-year></span> <span data-brand></span>. All rights reserved.</span>' +
        '<nav aria-label="Legal and policies">' +
          '<a href="' + R + 'privacy.html">Privacy Policy</a>' +
          '<a href="' + R + 'terms.html">Terms &amp; Conditions</a>' +
          '<a href="' + R + 'refund.html">Refund Policy</a>' +
          '<a href="' + R + 'contact.html">Contact</a>' +
        '</nav>' +
      '</div>' +
    '</div>' +

    /* Kept inside the footer landmark so landmark navigation can reach it. */
    '<a class="wa-float" data-cfg-href="whatsapp" href="#" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + WA_PATH + '"/></svg>' +
    '</a>' +
  '</footer>';

  function fillList(sel, kind, page, label) {
    var ul = d.querySelector(sel);
    if (!ul || !w.NGA_Store) return;
    w.NGA_Store.getItems(kind).then(function (list) {
      if (!list.length) return;
      var esc = w.NGA_esc || function (x) { return x; };
      ul.innerHTML = list.slice(0, 6).map(function (p) {
        return '<li><a href="' + R + page + "?slug=" + encodeURIComponent(p.slug) + '">' +
               esc(p.name) + "</a></li>";
      }).join("") + '<li><a href="' + R + (kind === "products" ? "products.html" : "services.html") +
        '"><strong>' + label + ' &rarr;</strong></a></li>';
    });
  }

  function mount() {
    var navHost = d.querySelector("[data-nav]");
    if (navHost) navHost.outerHTML = NAV;

    var footHost = d.querySelector("[data-footer]");
    if (footHost) footHost.outerHTML = FOOTER;

    if (w.NGA_paintIcons) w.NGA_paintIcons();

    fillList("[data-footer-products]", "products", "product.html", "All products");
    fillList("[data-footer-services]", "services", "service.html", "All services");
  }

  // Runs before main.js so that data-cfg bindings are in the DOM in time.
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", mount);
  else mount();
})(window, document);
