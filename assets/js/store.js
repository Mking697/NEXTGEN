/* ============================================================
   ESSOR AUTOMATIONS — Data Layer
   One API, two backends:
     A) Supabase configured  -> live read + admin write
     B) Not configured       -> reads data/*.json (site keeps working)

   Handles two collections: "products" and "services".
   ============================================================ */

(function (w) {
  "use strict";

  var CFG = w.NGA_CONFIG || {};
  var SB_URL = (CFG.supabase && CFG.supabase.url || "").trim();
  var SB_KEY = (CFG.supabase && CFG.supabase.anonKey || "").trim();
  var LIVE = !!(SB_URL && SB_KEY);

  var COLLECTIONS = ["products", "services"];

  var sb = null;
  var sbReady = null;

  /* ---- root path based on current URL depth ---- */
  var _depth = w.location.pathname.split("/").filter(Boolean).length - 1;
  var ROOT = _depth > 0 ? new Array(_depth + 1).join("../") : "./";

  /* ---------- Supabase loader (CDN, only when needed) ---------- */
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = res;
      s.onerror = function () { rej(new Error("Script load failed: " + src)); };
      document.head.appendChild(s);
    });
  }

  function client() {
    if (!LIVE) return Promise.resolve(null);
    if (sbReady) return sbReady;
    sbReady = (w.supabase && w.supabase.createClient
      ? Promise.resolve()
      : loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js")
    ).then(function () {
      sb = w.supabase.createClient(SB_URL, SB_KEY, {
        auth: { persistSession: true, autoRefreshToken: true }
      });
      return sb;
    }).catch(function (e) {
      console.warn("[NGA] Supabase failed to load, falling back to JSON.", e);
      return null;
    });
    return sbReady;
  }

  /* ---------- JSON fallback ---------- */
  var jsonCache = {};
  function readJSON(file) {
    if (jsonCache[file]) return jsonCache[file];
    jsonCache[file] = fetch(ROOT + "data/" + file + ".json", { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error(file + ".json " + r.status);
        return r.json();
      })
      .catch(function (e) {
        console.warn("[NGA] Could not read " + file + ".json:", e.message);
        return (file === "site") ? {} : [];
      });
    return jsonCache[file];
  }

  /* ---------- local draft (admin preview without Supabase) ---------- */
  function lsKey(kind) { return "nga_" + kind + "_draft"; }
  var LS_S = "nga_settings_draft";

  function lsGet(k, fb) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }
    catch (e) { return fb; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  }

  function slugify(s) {
    return String(s || "").toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
  }

  function sortItems(list) {
    return list.slice().sort(function (a, b) {
      return (a.sort_order || 0) - (b.sort_order || 0) ||
             String(a.name || "").localeCompare(String(b.name || ""));
    });
  }

  function assertKind(kind) {
    if (COLLECTIONS.indexOf(kind) < 0) throw new Error("Unknown collection: " + kind);
    return kind;
  }

  /* ============================================================
     PUBLIC API
     ============================================================ */
  var Store = {

    LIVE: LIVE,
    ROOT: ROOT,
    COLLECTIONS: COLLECTIONS,
    slugify: slugify,

    mode: function () { return LIVE ? "supabase" : "json"; },

    /* ---------- generic collection read ---------- */
    getItems: function (kind, opts) {
      assertKind(kind);
      opts = opts || {};

      if (LIVE) {
        return client().then(function (c) {
          if (!c) return readJSON(kind);
          var q = c.from(kind).select("*").order("sort_order", { ascending: true });
          if (!opts.includeHidden) q = q.eq("published", true);
          return q.then(function (r) {
            if (r.error) { console.warn("[NGA]", r.error.message); return readJSON(kind); }
            return r.data || [];
          });
        });
      }

      var draft = lsGet(lsKey(kind), null);
      if (draft && draft.length) {
        return Promise.resolve(sortItems(
          opts.includeHidden ? draft : draft.filter(function (p) { return p.published !== false; })
        ));
      }
      return readJSON(kind).then(function (list) {
        list = Array.isArray(list) ? list : [];
        return sortItems(opts.includeHidden ? list : list.filter(function (p) { return p.published !== false; }));
      });
    },

    getItem: function (kind, slug) {
      return Store.getItems(kind, { includeHidden: true }).then(function (list) {
        return list.filter(function (p) { return p.slug === slug; })[0] || null;
      });
    },

    saveItem: function (kind, p) {
      assertKind(kind);
      p = Object.assign({}, p);
      if (!p.slug) p.slug = slugify(p.name);

      if (LIVE) {
        return client().then(function (c) {
          if (!c) throw new Error("Supabase is not available");
          var row = Object.assign({}, p);
          if (!row.id) delete row.id;
          return c.from(kind).upsert(row, { onConflict: "slug" }).select().then(function (r) {
            if (r.error) throw new Error(r.error.message);
            return (r.data || [])[0];
          });
        });
      }

      return Store.getItems(kind, { includeHidden: true }).then(function (list) {
        var i = list.findIndex(function (x) { return x.slug === p.slug || (p.id && x.id === p.id); });
        if (!p.id) p.id = "loc_" + Date.now();
        if (i > -1) list[i] = Object.assign({}, list[i], p); else list.push(p);
        lsSet(lsKey(kind), list);
        return p;
      });
    },

    deleteItem: function (kind, idOrSlug) {
      assertKind(kind);
      if (LIVE) {
        return client().then(function (c) {
          if (!c) throw new Error("Supabase is not available");
          return c.from(kind).delete().or("slug.eq." + idOrSlug + ",id.eq." + idOrSlug)
            .then(function (r) { if (r.error) throw new Error(r.error.message); return true; });
        });
      }
      return Store.getItems(kind, { includeHidden: true }).then(function (list) {
        lsSet(lsKey(kind), list.filter(function (x) {
          return x.slug !== idOrSlug && String(x.id) !== String(idOrSlug);
        }));
        return true;
      });
    },

    /* ---------- convenience wrappers ---------- */
    getProducts: function (opts) { return Store.getItems("products", opts); },
    getProduct:  function (slug) { return Store.getItem("products", slug); },
    getServices: function (opts) { return Store.getItems("services", opts); },
    getService:  function (slug) { return Store.getItem("services", slug); },

    saveProduct:   function (p) { return Store.saveItem("products", p); },
    deleteProduct: function (k) { return Store.deleteItem("products", k); },
    saveService:   function (s) { return Store.saveItem("services", s); },
    deleteService: function (k) { return Store.deleteItem("services", k); },

    /* ---------- SETTINGS ---------- */
    getSettings: function () {
      if (LIVE) {
        return client().then(function (c) {
          if (!c) return readJSON("site");
          return c.from("settings").select("data").eq("id", 1).maybeSingle().then(function (r) {
            if (r.error || !r.data) return readJSON("site");
            return r.data.data || {};
          });
        });
      }
      var d = lsGet(LS_S, null);
      if (d) return Promise.resolve(d);
      return readJSON("site");
    },

    saveSettings: function (data) {
      if (LIVE) {
        return client().then(function (c) {
          if (!c) throw new Error("Supabase is not available");
          return c.from("settings").upsert({ id: 1, data: data }).then(function (r) {
            if (r.error) throw new Error(r.error.message);
            return true;
          });
        });
      }
      lsSet(LS_S, data);
      return Promise.resolve(true);
    },

    /* ---------- LEADS ---------- */
    submitLead: function (lead) {
      lead = Object.assign({ source: location.pathname, created_at: new Date().toISOString() }, lead);

      if (LIVE) {
        return client().then(function (c) {
          if (!c) return Store._leadFallback(lead);
          return c.from("leads").insert(lead).then(function (r) {
            if (r.error) throw new Error(r.error.message);
            return { ok: true, via: "supabase" };
          });
        });
      }
      return Store._leadFallback(lead);
    },

    _leadFallback: function (lead) {
      var fb = CFG.leadFallback || {};
      var txt =
        "New Enquiry — " + (CFG.brand && CFG.brand.name || "Website") + "\n" +
        "Name: " + (lead.name || "-") + "\n" +
        "Phone: " + (lead.phone || "-") + "\n" +
        "Email: " + (lead.email || "-") + "\n" +
        "Interested in: " + (lead.product || "-") + "\n" +
        "Message: " + (lead.message || "-");

      if (fb.mode === "formspree" && fb.formspreeUrl) {
        return fetch(fb.formspreeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(lead)
        }).then(function (r) {
          if (!r.ok) throw new Error("Formspree error");
          return { ok: true, via: "formspree" };
        });
      }

      if (fb.mode === "mailto") {
        var to = (CFG.contact && CFG.contact.email) || "";
        w.open("mailto:" + to + "?subject=" + encodeURIComponent("Website Enquiry") +
               "&body=" + encodeURIComponent(txt), "_blank");
        return Promise.resolve({ ok: true, via: "mailto" });
      }

      var wa = (CFG.contact && CFG.contact.whatsapp) || "";
      w.open("https://wa.me/" + wa + "?text=" + encodeURIComponent(txt), "_blank");
      return Promise.resolve({ ok: true, via: "whatsapp" });
    },

    getLeads: function () {
      if (!LIVE) return Promise.resolve([]);
      return client().then(function (c) {
        if (!c) return [];
        return c.from("leads").select("*").order("created_at", { ascending: false }).limit(500)
          .then(function (r) { return r.error ? [] : (r.data || []); });
      });
    },

    deleteLead: function (id) {
      if (!LIVE) return Promise.resolve(true);
      return client().then(function (c) {
        return c.from("leads").delete().eq("id", id).then(function () { return true; });
      });
    },

    /* ---------- AUTH ---------- */
    auth: {
      signIn: function (email, password) {
        if (!LIVE) {
          var pass = (CFG.admin && CFG.admin.demoPasscode) || "";
          if (password === pass) {
            sessionStorage.setItem("nga_demo_admin", "1");
            return Promise.resolve({ demo: true, email: email || "demo@local" });
          }
          return Promise.reject(new Error("Wrong passcode. (Demo mode — configure Supabase for a real login.)"));
        }
        return client().then(function (c) {
          return c.auth.signInWithPassword({ email: email, password: password }).then(function (r) {
            if (r.error) throw new Error(r.error.message);
            return r.data.user;
          });
        });
      },
      signOut: function () {
        sessionStorage.removeItem("nga_demo_admin");
        if (!LIVE) return Promise.resolve();
        return client().then(function (c) { return c.auth.signOut(); });
      },
      current: function () {
        if (!LIVE) {
          return Promise.resolve(sessionStorage.getItem("nga_demo_admin") ? { email: "demo@local", demo: true } : null);
        }
        return client().then(function (c) {
          if (!c) return null;
          return c.auth.getUser().then(function (r) { return (r.data && r.data.user) || null; });
        });
      }
    }
  };

  w.NGA_Store = Store;
})(window);
