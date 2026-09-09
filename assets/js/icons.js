/* ============================================================
   NEXT GEN AUTOMATION — SVG icon set
   Emoji ki jagah proper stroke icons (24x24, currentColor).
   Use: <span data-icon="zap"></span>
   ============================================================ */
(function (w, d) {
  "use strict";

  var P = {
    zap:        '<path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z"/>',
    building:   '<path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M15 21v-9h4a2 2 0 0 1 2 2v7"/><path d="M9 7h2M9 11h2M9 15h2"/>',
    sliders:    '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    mobile:     '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18.5h2"/>',
    shield:     '<path d="M12 22s8-3.5 8-10V5.5L12 2.5 4 5.5V12c0 6.5 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    headset:    '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><path d="M4 14h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4ZM20 14h-2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4Z"/><path d="M20 19v.5a2.5 2.5 0 0 1-2.5 2.5H13"/>',
    chat:       '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-3.5-.7L3 21l1.8-4.9A8.2 8.2 0 0 1 3.6 11.5a8.4 8.4 0 0 1 8.9-8.4 8.4 8.4 0 0 1 8.5 8.4Z"/>',
    pill:       '<path d="M10.5 20.5a5 5 0 0 1-7-7l7-7a5 5 0 1 1 7 7l-7 7Z"/><path d="m8.5 5.5 7 7"/>',
    chart:      '<path d="M3 3v18h18"/><path d="m7 15 3.5-4 3 2.5L20 7"/>',
    target:     '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
    tool:       '<path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.8 2.8 0 0 1-4-4l9.4-9.4a4 4 0 0 0-1-1Z"/><path d="M14.7 6.3 18 3l3 3-3.3 3.3"/>',
    refresh:    '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>',
    phone:      '<path d="M21 16.9v2.6a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6A19.6 19.6 0 0 1 1.3 4a2 2 0 0 1 2-2.2h2.6a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    mail:       '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 7 9 6 9-6"/>',
    check:      '<path d="m5 13 4.5 4.5L19 6.5"/>',
    close:      '<path d="M6 6l12 12M18 6 6 18"/>',
    arrowUp:    '<path d="M12 20V5M6 11l6-6 6 6"/>',
    grid:       '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
    box:        '<path d="m12 2.5 8.5 4.7v9.6L12 21.5l-8.5-4.7V7.2L12 2.5Z"/><path d="m3.5 7.2 8.5 4.8 8.5-4.8M12 21.5V12"/>',
    gear:       '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/>',
    download:   '<path d="M12 3v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
    upload:     '<path d="M12 21V9M7 13l5-5 5 5"/><path d="M4 4h16"/>',
    external:   '<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
    pencil:     '<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
    trash:      '<path d="M3.5 6h17M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6"/><path d="M18.5 6 18 19.5a2 2 0 0 1-2 1.9H8a2 2 0 0 1-2-1.9L5.5 6"/><path d="M10 11v6M14 11v6"/>',
    logout:     '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5"/><path d="M5 12h11"/>',
    user:       '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
  };

  function svg(name, size) {
    var p = P[name];
    if (!p) return "";
    return '<svg viewBox="0 0 24 24" width="' + (size || 24) + '" height="' + (size || 24) +
      '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + "</svg>";
  }

  function paint(root) {
    var nodes = (root || d).querySelectorAll("[data-icon]:not([data-icon-done])");
    Array.prototype.forEach.call(nodes, function (el) {
      var name = el.getAttribute("data-icon");
      var size = el.getAttribute("data-icon-size");
      var markup = svg(name, size ? parseInt(size, 10) : undefined);
      if (markup) {
        el.innerHTML = markup;
        el.setAttribute("data-icon-done", "1");
      }
    });
  }

  w.NGA_icon = svg;
  w.NGA_paintIcons = paint;

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { paint(); });
  else paint();
})(window, document);
