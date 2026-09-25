/* ============================================================
   ESSOR AUTOMATIONS — Admin Panel logic
   Handles both collections: products and services.
   ============================================================ */
(function (w, d) {
  "use strict";
  var S = w.NGA_Store;
  var CFG = w.NGA_CONFIG || {};

  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function paint(el) { if (w.NGA_paintIcons) w.NGA_paintIcons(el); }

  var state = { products: [], services: [], leads: [] };

  var LABEL = {
    products: { one: "Product", many: "Products", rows: "#productRows", search: "#pSearch", status: "#pSearchStatus" },
    services: { one: "Service", many: "Services", rows: "#serviceRows", search: "#sSearch", status: "#sSearchStatus" }
  };

  /* ---------- Toast ---------- */
  var toastEl = $("#toast"), toastAlertEl = $("#toastAlert"), toastTimer;
  function toast(msg, ok) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = "toast show " + (ok === false ? "err" : "ok");
    /* Failures go through role="alert" so they interrupt rather than queue. */
    if (ok === false && toastAlertEl) toastAlertEl.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.className = "toast";
      if (toastAlertEl) toastAlertEl.textContent = "";
    }, Math.max(3200, 2000 + msg.length * 55));
  }

  /* ---------- Auth gate ---------- */
  function guard() {
    return S.auth.current().then(function (u) {
      if (!u) { location.replace("index.html"); return null; }
      var who = $("#whoami");
      if (who) who.textContent = u.email || "admin";
      return u;
    });
  }

  /* ---------- Mode banners ---------- */
  function renderMode() {
    var tag = $("#modeTag2");
    if (tag) {
      tag.className = "mode-tag " + (S.LIVE ? "mode-live" : "mode-json");
      tag.textContent = S.LIVE ? "Live · Supabase" : "Demo · local only";
    }

    var banner = $("#modeBanner");
    if (banner && !S.LIVE) {
      banner.innerHTML =
        '<div class="banner warn"><strong>You are in demo mode.</strong> ' +
        'Changes are saved only in this browser &mdash; they will not appear on the live website. ' +
        'Two ways to go live: (1) add your Supabase keys in <code>assets/js/config.js</code>, or ' +
        '(2) edit here, then use <em>Backup / Export</em> to download the JSON and upload it to the ' +
        '<code>data/</code> folder on Hostinger.</div>';
    }

    var lb = $("#leadsBanner");
    if (lb && !S.LIVE) {
      lb.innerHTML =
        '<div class="banner warn">Leads only appear here once Supabase is configured. ' +
        'Right now form submissions go to <strong>' +
        esc((CFG.leadFallback && CFG.leadFallback.mode) || "whatsapp") + "</strong>.</div>";
    }

    var bb = $("#backupBanner");
    if (bb) {
      bb.innerHTML = S.LIVE
        ? "<strong>Live mode:</strong> everything saves to Supabase. These exports are for backup only."
        : "<strong>Demo mode:</strong> downloading here and replacing the files in <code>data/</code> is how changes reach the live site.";
    }
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    $$(".side-btn[data-pane]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-pane");
        $$(".side-btn[data-pane]").forEach(function (x) {
          x.classList.remove("active");
          x.removeAttribute("aria-current");
        });
        b.classList.add("active");
        b.setAttribute("aria-current", "page");

        $$(".pane").forEach(function (p) { p.classList.remove("active"); });
        var pane = $("#pane-" + id);
        if (pane) {
          pane.classList.add("active");
          pane.setAttribute("tabindex", "-1");
          pane.focus(); // moves the screen reader to the new heading
        }
        location.hash = id;
        w.scrollTo(0, 0);
      });
    });

    var h = (location.hash || "").replace("#", "");
    if (h) {
      var btn = $('.side-btn[data-pane="' + h + '"]');
      if (btn) btn.click();
    }
  }

  /* ---------- Table rendering ---------- */
  function statusBadge(st) {
    if (st === "soon") return '<span class="badge badge-soon">Soon</span>';
    if (st === "beta") return '<span class="badge badge-beta">Beta</span>';
    return '<span class="badge badge-live"><span class="dot live"></span>Live</span>';
  }

  function load(kind) {
    return S.getItems(kind, { includeHidden: true }).then(function (list) {
      state[kind] = list || [];
      renderTable(kind);
      renderStats();
      return state[kind];
    }).catch(function (e) {
      toast("Could not load " + kind + ": " + e.message, false);
    });
  }

  function renderTable(kind, filter) {
    var tb = $(LABEL[kind].rows);
    if (!tb) return;
    var isProduct = kind === "products";
    var cols = isProduct ? 6 : 5;

    var q = (filter || "").toLowerCase();
    var list = state[kind].filter(function (p) {
      if (!q) return true;
      return (p.name + " " + (p.category || "") + " " + (p.slug || "")).toLowerCase().indexOf(q) > -1;
    });

    if (!list.length) {
      tb.innerHTML = '<tr><td colspan="' + cols +
        '" style="color:var(--text-faint);padding:34px;text-align:center">Nothing found.</td></tr>';
      return list.length;
    }

    tb.innerHTML = list.map(function (p) {
      var grad = "linear-gradient(135deg," + (p.color_from || "#5B7CFF") + "," + (p.color_to || "#22D3EE") + ")";
      var key = p.slug || p.id;
      var badge = p.logo_text || (p.name || "?").slice(0, 2).toUpperCase();

      return "<tr>" +
        "<td style='color:var(--text-faint)'>" + esc(p.sort_order != null ? p.sort_order : "-") + "</td>" +
        "<td><div class='t-name'>" +
          "<span class='t-logo' style='background:" + grad + "'>" + esc(badge) + "</span>" +
          "<span><b>" + esc(p.name) + "</b><small>" + esc(p.tagline || p.slug || "") + "</small></span>" +
        "</div></td>" +
        "<td>" + esc(p.category || "-") + "</td>" +
        (isProduct ? "<td>" + statusBadge(p.status) + "</td>" : "") +
        "<td><label class='switch'>" +
          "<input type='checkbox' data-pub='" + esc(key) + "' data-kind='" + kind + "'" +
          (p.published !== false ? " checked" : "") + ">" +
          "<i></i><span class='sr-only'>Show " + esc(p.name) + " on the website</span>" +
        "</label></td>" +
        "<td><div class='t-actions'>" +
          (p.url ? "<a class='icon-btn' href='" + esc(p.url) + "' target='_blank' rel='noopener' " +
                   "title='Open site' aria-label='Open " + esc(p.name) + " website' data-icon='external'></a>" : "") +
          "<button class='icon-btn' data-edit='" + esc(key) + "' data-kind='" + kind +
            "' title='Edit' aria-label='Edit " + esc(p.name) + "' data-icon='pencil'></button>" +
          "<button class='icon-btn danger' data-del='" + esc(key) + "' data-kind='" + kind +
            "' title='Delete' aria-label='Delete " + esc(p.name) + "' data-icon='trash'></button>" +
        "</div></td>" +
      "</tr>";
    }).join("");

    paint(tb);
    return list.length;
  }

  function renderStats() {
    var set = function (id, v) { var el = $(id); if (el) el.textContent = v; };
    set("#statTotal", state.products.length);
    set("#statLive", state.products.filter(function (x) { return x.status === "live"; }).length);
    set("#statServices", state.services.length);
    set("#statLeads", state.leads.length);
  }

  /* ============================================================
     MODAL — shared by products and services
     ============================================================ */
  var modal = $("#itemModal"), iForm = $("#itemForm");
  var currentKind = "products";
  var lastFocus = null;
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
                  'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function showKindFields(kind) {
    $$("[data-only]", modal).forEach(function (el) {
      el.classList.toggle("hidden", el.getAttribute("data-only") !== kind);
    });
  }

  function openModal(kind, p) {
    if (!modal) return;
    currentKind = kind;
    lastFocus = d.activeElement;

    $("#modalTitle").textContent = (p ? "Edit " : "New ") + LABEL[kind].one;
    iForm.reset();
    iForm.elements.id.value = "";
    showKindFields(kind);

    var f = iForm.elements;
    if (p) {
      ["id", "name", "slug", "tagline", "category", "status", "icon", "sort_order", "url",
       "description", "long_description", "price", "old_price", "price_note", "logo_text",
       "color_from", "color_to"].forEach(function (k) {
        if (f[k] && p[k] != null) f[k].value = p[k];
      });
      var join = function (v) { return Array.isArray(v) ? v.join("\n") : (v || ""); };
      if (f.features) f.features.value = Array.isArray(p.features) ? p.features.join(", ") : (p.features || "");
      if (f.highlights) f.highlights.value = join(p.highlights);
      if (f.deliverables) f.deliverables.value = join(p.deliverables);
      if (f.outcomes) f.outcomes.value = join(p.outcomes);
      f.published.checked = p.published !== false;
      f.featured.checked = !!p.featured;
      if (!p.color_from) f.color_from.value = "#5B7CFF";
      if (!p.color_to) f.color_to.value = "#22D3EE";
    } else {
      f.color_from.value = "#5B7CFF";
      f.color_to.value = "#22D3EE";
      f.sort_order.value = state[kind].length + 1;
      f.published.checked = true;
    }

    modal.classList.add("open");
    d.body.style.overflow = "hidden";
    var shell = $(".admin-shell");
    if (shell) shell.setAttribute("inert", "");
    setTimeout(function () { f.name.focus(); }, 60);
  }

  function closeModal() {
    if (!modal || !modal.classList.contains("open")) return;
    modal.classList.remove("open");
    d.body.style.overflow = "";
    var shell = $(".admin-shell");
    if (shell) shell.removeAttribute("inert");
    if (lastFocus && d.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  }

  function trapTab(e) {
    var f = $$(FOCUSABLE, modal).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function initModal() {
    if (!modal) return;

    $$("[data-add]").forEach(function (b) {
      b.addEventListener("click", function () { openModal(b.getAttribute("data-add"), null); });
    });
    $$("[data-close-modal]").forEach(function (b) { b.addEventListener("click", closeModal); });
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });

    modal.addEventListener("keydown", function (e) {
      if (e.key === "Tab") return trapTab(e);
      if (e.key !== "Escape") return;
      /* Let a <select> dismiss its own dropdown instead of closing the dialog
         and discarding everything typed so far. */
      var t = e.target;
      if (t.tagName === "SELECT") return;
      e.stopPropagation();
      closeModal();
    });

    iForm.elements.name.addEventListener("blur", function () {
      var f = iForm.elements;
      if (!f.slug.value.trim()) f.slug.value = S.slugify(f.name.value);
      if (f.logo_text && !f.logo_text.value.trim()) {
        f.logo_text.value = (f.name.value || "").slice(0, 2).toUpperCase();
      }
    });

    iForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = iForm.elements;
      var name = f.name.value.trim();
      if (name.length < 2) {
        f.name.focus();
        return toast("Please enter a name.", false);
      }

      var lines = function (v) {
        return String(v || "").split("\n").map(function (x) { return x.trim(); }).filter(Boolean);
      };

      var item = {
        name: name,
        slug: f.slug.value.trim() || S.slugify(name),
        tagline: f.tagline.value.trim(),
        category: f.category.value.trim(),
        sort_order: parseInt(f.sort_order.value, 10) || 99,
        description: f.description.value.trim(),
        long_description: f.long_description.value.trim(),
        price: f.price.value.trim(),
        price_note: f.price_note.value.trim(),
        color_from: f.color_from.value,
        color_to: f.color_to.value,
        published: f.published.checked,
        featured: f.featured.checked
      };
      if (f.id.value) item.id = f.id.value;

      if (currentKind === "products") {
        item.status = f.status.value;
        item.url = f.url.value.trim();
        item.old_price = f.old_price.value.trim();
        item.logo_text = f.logo_text.value.trim() || name.slice(0, 2).toUpperCase();
        item.features = f.features.value.split(",").map(function (x) { return x.trim(); }).filter(Boolean);
        item.highlights = lines(f.highlights.value);
      } else {
        item.icon = f.icon.value;
        item.deliverables = lines(f.deliverables.value);
        item.outcomes = lines(f.outcomes.value);
      }

      var btn = $("#saveBtn");
      btn.disabled = true; btn.textContent = "Saving...";
      var kind = currentKind;

      S.saveItem(kind, item).then(function () {
        closeModal();
        toast(LABEL[kind].one + " saved.");
        return load(kind);
      }).catch(function (err) {
        toast("Save failed: " + err.message, false);
      }).then(function () {
        btn.disabled = false; btn.textContent = "Save";
      });
    });
  }

  /* ---------- Table actions ---------- */
  function initTableActions(kind) {
    var tb = $(LABEL[kind].rows);
    if (!tb) return;

    tb.addEventListener("click", function (e) {
      var ed = e.target.closest("[data-edit]");
      if (ed) {
        var key = ed.getAttribute("data-edit");
        var p = state[kind].filter(function (x) { return (x.slug || x.id) === key; })[0];
        if (p) openModal(kind, p);
        return;
      }

      var dl = e.target.closest("[data-del]");
      if (dl) {
        var k = dl.getAttribute("data-del");
        var item = state[kind].filter(function (x) { return (x.slug || x.id) === k; })[0];
        if (!item) return;
        if (!w.confirm("Delete “" + item.name + "”? This cannot be undone.")) return;
        S.deleteItem(kind, k).then(function () {
          toast(LABEL[kind].one + " deleted.");
          return load(kind);
        }).catch(function (err) { toast("Delete failed: " + err.message, false); });
      }
    });

    tb.addEventListener("change", function (e) {
      var cb = e.target.closest("[data-pub]");
      if (!cb) return;
      var key = cb.getAttribute("data-pub");
      var p = state[kind].filter(function (x) { return (x.slug || x.id) === key; })[0];
      if (!p) return;

      S.saveItem(kind, Object.assign({}, p, { published: cb.checked })).then(function () {
        p.published = cb.checked;
        toast(p.name + (cb.checked ? " is now visible." : " is now hidden."));
      }).catch(function (err) {
        cb.checked = !cb.checked;
        toast("Update failed: " + err.message, false);
      });
    });

    var search = $(LABEL[kind].search);
    if (search) {
      search.addEventListener("input", function () {
        var n = renderTable(kind, search.value);
        var st = $(LABEL[kind].status);
        if (st) st.textContent = n + " " + (n === 1 ? LABEL[kind].one : LABEL[kind].many) + " shown.";
      });
    }
  }

  /* ---------- Leads ---------- */
  function loadLeads() {
    return S.getLeads().then(function (list) {
      state.leads = list || [];
      renderLeads();
      renderRecentLeads();
      renderStats();
    }).catch(function () { state.leads = []; renderLeads(); renderRecentLeads(); });
  }

  function fmtDate(s) {
    if (!s) return "-";
    var dt = new Date(s);
    if (isNaN(dt)) return String(s);
    return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) + ", " +
           dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  function renderLeads(filter) {
    var tb = $("#leadRows");
    if (!tb) return 0;
    var q = (filter || "").toLowerCase();
    var list = state.leads.filter(function (l) {
      if (!q) return true;
      return ((l.name || "") + " " + (l.phone || "") + " " + (l.email || "") + " " + (l.product || ""))
        .toLowerCase().indexOf(q) > -1;
    });

    if (!list.length) {
      tb.innerHTML = '<tr><td colspan="7" style="color:var(--text-faint);padding:34px;text-align:center">' +
        (S.LIVE ? "No leads yet." : "Demo mode — leads only come from Supabase.") + "</td></tr>";
      return 0;
    }

    tb.innerHTML = list.map(function (l) {
      var digits = String(l.phone || "").replace(/\D/g, "");
      var wa = digits.length === 10 ? "91" + digits : digits;
      return "<tr>" +
        "<td><b>" + esc(l.name || "-") + "</b></td>" +
        "<td>" + (digits ? "<a href='https://wa.me/" + wa + "' target='_blank' rel='noopener' " +
          "style='color:var(--brand-2)'>" + esc(l.phone) + "</a>" : "-") + "</td>" +
        "<td>" + (l.email ? "<a href='mailto:" + esc(l.email) + "' style='color:var(--brand-2)'>" +
          esc(l.email) + "</a>" : "-") + "</td>" +
        "<td>" + esc(l.product || "-") + "</td>" +
        "<td style='max-width:280px;color:var(--text-dim)'>" + esc((l.message || "-").slice(0, 90)) + "</td>" +
        "<td style='white-space:nowrap;color:var(--text-faint)'>" + esc(fmtDate(l.created_at)) + "</td>" +
        "<td><button class='icon-btn danger' data-dellead='" + esc(l.id) +
          "' title='Delete' aria-label='Delete lead from " + esc(l.name || "unknown") + "' data-icon='trash'></button></td>" +
      "</tr>";
    }).join("");

    paint(tb);
    return list.length;
  }

  function renderRecentLeads() {
    var tb = $("#recentLeads");
    if (!tb) return;
    var list = state.leads.slice(0, 5);
    if (!list.length) {
      tb.innerHTML = '<tr><td colspan="4" style="color:var(--text-faint)">' +
        (S.LIVE ? "No leads yet." : "Demo mode — leads only come from Supabase.") + "</td></tr>";
      return;
    }
    tb.innerHTML = list.map(function (l) {
      return "<tr><td><b>" + esc(l.name || "-") + "</b></td><td>" + esc(l.phone || "-") +
        "</td><td>" + esc(l.product || "-") + "</td><td style='color:var(--text-faint)'>" +
        esc(fmtDate(l.created_at)) + "</td></tr>";
    }).join("");
  }

  function initLeads() {
    var tb = $("#leadRows");
    if (tb) {
      tb.addEventListener("click", function (e) {
        var b = e.target.closest("[data-dellead]");
        if (!b) return;
        if (!w.confirm("Delete this lead?")) return;
        var id = b.getAttribute("data-dellead");
        S.deleteLead(id).then(function () {
          state.leads = state.leads.filter(function (x) { return String(x.id) !== String(id); });
          renderLeads($("#lSearch") ? $("#lSearch").value : "");
          renderRecentLeads(); renderStats();
          toast("Lead deleted.");
        });
      });
    }

    var s = $("#lSearch");
    if (s) s.addEventListener("input", function () {
      var n = renderLeads(s.value);
      var st = $("#lSearchStatus");
      if (st) st.textContent = n + (n === 1 ? " lead" : " leads") + " shown.";
    });

    var ex = $("#exportLeads");
    if (ex) ex.addEventListener("click", function () {
      if (!state.leads.length) return toast("There are no leads to export.", false);
      var cols = ["name", "phone", "email", "product", "message", "source", "created_at"];
      var csv = [cols.join(",")].concat(state.leads.map(function (l) {
        return cols.map(function (c) {
          return '"' + String(l[c] == null ? "" : l[c]).replace(/"/g, '""') + '"';
        }).join(",");
      })).join("\n");
      download("leads-" + new Date().toISOString().slice(0, 10) + ".csv", csv, "text/csv");
      toast("CSV downloaded.");
    });
  }

  /* ---------- Settings ---------- */
  function initSettings() {
    var form = $("#settingsForm");
    if (!form) return;
    var okBox = $("[data-alert-ok]", form), errBox = $("[data-alert-err]", form);

    function say(msg, ok) {
      var box = ok ? okBox : errBox;
      [okBox, errBox].forEach(function (b) { if (b) { b.classList.remove("show"); b.textContent = ""; } });
      if (!box) return;
      box.classList.add("show");
      requestAnimationFrame(function () { box.textContent = msg; });
    }

    S.getSettings().then(function (s) {
      s = s || {};
      var map = { "s-pill": "hero_pill", "s-title": "hero_title", "s-sub": "hero_sub",
                  "s-cta": "cta_title", "s-ctasub": "cta_sub" };
      Object.keys(map).forEach(function (id) {
        var el = $("#" + id);
        if (el && s[map[id]]) el.value = s[map[id]];
      });
      if (s.seo) {
        if ($("#s-seotitle")) $("#s-seotitle").value = s.seo.title || "";
        if ($("#s-seodesc")) $("#s-seodesc").value = s.seo.description || "";
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        hero_pill: $("#s-pill").value.trim(),
        hero_title: $("#s-title").value.trim(),
        hero_sub: $("#s-sub").value.trim(),
        cta_title: $("#s-cta").value.trim(),
        cta_sub: $("#s-ctasub").value.trim(),
        seo: { title: $("#s-seotitle").value.trim(), description: $("#s-seodesc").value.trim() }
      };
      S.saveSettings(data).then(function () {
        say(S.LIVE ? "Settings saved." : "Saved in demo mode — configure Supabase to make this live.", true);
      }).catch(function (err) { say("Save failed: " + err.message, false); });
    });
  }

  /* ---------- Backup ---------- */
  function download(filename, text, type) {
    var blob = new Blob([text], { type: (type || "application/json") + ";charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = d.createElement("a");
    a.href = url; a.download = filename;
    d.body.appendChild(a); a.click(); d.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function exportKind(kind) {
    var clean = state[kind].map(function (p) {
      var o = Object.assign({}, p);
      delete o.created_at; delete o.updated_at;
      return o;
    });
    download(kind + ".json", JSON.stringify(clean, null, 2));
    toast(kind + ".json downloaded.");
  }

  function initBackup() {
    var dp = $("#dlProducts");
    if (dp) dp.addEventListener("click", function () { exportKind("products"); });
    var ds = $("#dlServices");
    if (ds) ds.addEventListener("click", function () { exportKind("services"); });

    var imp = $("#importBtn");
    if (imp) imp.addEventListener("click", function () {
      var input = $("#upFile");
      var kind = $("#upKind") ? $("#upKind").value : "products";
      if (!input || !input.files || !input.files[0]) return toast("Choose a file first.", false);

      var reader = new FileReader();
      reader.onload = function () {
        var list;
        try { list = JSON.parse(reader.result); }
        catch (err) { return toast("That file is not valid JSON.", false); }
        if (!Array.isArray(list)) return toast("The JSON must contain an array of items.", false);
        if (!w.confirm("Import " + list.length + " " + kind + "? Matching entries will be replaced.")) return;

        var chain = Promise.resolve();
        list.forEach(function (p) { chain = chain.then(function () { return S.saveItem(kind, p); }); });
        chain.then(function () {
          toast(list.length + " " + kind + " imported.");
          return load(kind);
        }).catch(function (err) { toast("Import failed: " + err.message, false); });
      };
      reader.readAsText(input.files[0]);
    });
  }

  /* ---------- Logout ---------- */
  function initLogout() {
    var b = $("#logoutBtn");
    if (b) b.addEventListener("click", function () {
      S.auth.signOut().then(function () { location.replace("index.html"); });
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    guard().then(function (u) {
      if (!u) return;
      paint();
      renderMode();
      initTabs();
      initModal();
      initTableActions("products");
      initTableActions("services");
      initLeads();
      initSettings();
      initBackup();
      initLogout();
      load("products");
      load("services");
      loadLeads();
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
