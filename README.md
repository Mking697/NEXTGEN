# NextGen Business Automation — Website

Static marketing site for NextGen Business Automation. Plain HTML, CSS and vanilla JavaScript — **no build step**, no framework. Upload the folder to Hostinger and it runs.

It sells two things:

- **Products** — 7 in-house SaaS products (5 live in production)
- **Services** — 7 agency services (Meta Ads, Google Ads, WhatsApp automation, landing pages, creative, SEO, custom development)

---

## 🚨 Before you run a single ad

The site is built, but it is **not launch-ready** until you fill in `assets/js/config.js`. Open any page with the browser console open and it will list exactly what is missing.

| # | What | Why it blocks launch |
|---|------|----------------------|
| 1 | `contact.whatsapp` + `contact.phone` | Still placeholders. Every form submission and WhatsApp button currently goes to a number that does not exist — **the lead is silently lost while the visitor is told it worked.** |
| 2 | `tracking.metaPixelId` | Empty, so no `PageView` and no `Lead` events fire. Meta cannot optimise, retarget, or build a lookalike. You would be buying cold traffic blind. |
| 3 | `supabase.url` + `supabase.anonKey` | Without these, leads are not stored anywhere. |
| 4 | Legal pages | `privacy.html`, `terms.html`, `refund.html` are templates. Add your registered company name, address and GSTIN. |
| 5 | Domain | Replace `nextgenauto.online` in `sitemap.xml` and in each page's `<link rel="canonical">` and `og:` tags. |

Fix 1 and 2 first. Nothing else matters until a submitted form produces a lead you can actually retrieve.

---

## Project structure

```
NEXTGEN/
├── index.html              Homepage (products + services + FAQ + lead form)
├── products.html           All products, filterable
├── product.html            Product detail   (?slug=chatxflow)
├── services.html           All services, filterable
├── service.html            Service detail   (?slug=meta-ads-management)
├── about.html  contact.html  thank-you.html  404.html
├── privacy.html  terms.html  refund.html
│
├── admin/
│   ├── index.html          Login
│   └── dashboard.html      Products, Services, Leads, Settings, Backup
│
├── assets/
│   ├── css/style.css       Design system (tokens at the top)
│   ├── css/admin.css       Admin panel only
│   └── js/
│       ├── config.js       ← THE ONLY FILE YOU NORMALLY EDIT
│       ├── store.js        Data layer (Supabase ↔ JSON)
│       ├── layout.js       Shared nav + footer, injected at runtime
│       ├── icons.js        Inline SVG icon set
│       ├── main.js         Nav, forms, tracking, animations
│       ├── products.js     Renders products AND services
│       └── admin.js        Admin panel logic
│
├── data/                   Fallback content when Supabase is not set up
│   ├── products.json  services.json  site.json
│
├── supabase-schema.sql     Run once in the Supabase SQL editor
├── sitemap.xml  robots.txt  .htaccess
```

---

## How the data layer works

`store.js` exposes one API over two backends:

- **Supabase configured** → live reads, and the admin panel writes straight to the database. Changes appear on the site immediately.
- **Not configured** → the site reads `data/*.json` and stays fully functional. The admin panel works in demo mode (changes saved to that browser only) and you publish by downloading JSON and uploading it.

Both `products` and `services` use the same generic functions, so anything that works for one works for the other.

---

## Going live on Hostinger

### Option A — with Supabase (recommended)

The admin panel becomes genuinely live: add a product, and it appears on the site instantly.

1. Create a project at [supabase.com](https://supabase.com) (free tier is enough).
2. SQL Editor → New query → paste **all** of `supabase-schema.sql` → **Run**.
3. Settings → API → copy the **Project URL** and **anon key** into `assets/js/config.js`.
4. Authentication → Users → **Add user** → your admin email and password (keep *Auto Confirm* on).
5. Upload the whole folder to `public_html/` via hPanel → File Manager.

The anon key is safe to ship publicly — Row Level Security in the schema means visitors can only read published rows and insert leads, never read other people's leads.

### Option B — JSON only

No database. Products and services come from `data/*.json`.

1. Upload the folder to `public_html/`.
2. Edit content in the admin panel (demo mode).
3. **Backup / Export** → download `products.json` / `services.json`.
4. Replace the old files in `public_html/data/` via File Manager.

Leads will not be stored — they go to WhatsApp instead (`leadFallback.mode` in config).

---

## Admin panel

Visit `/admin/` on your domain.

- **Supabase configured** → log in with the email and password you created in step 4.
- **Not configured** → demo passcode from `config.admin.demoPasscode` (default `nga@2026` — change it).

The panel is `noindex, nofollow`. For real protection, add password protection to the `/admin` folder in hPanel → **Directory Privacy**. The demo passcode is client-side and is **not** security.

What you can do: add / edit / delete products and services, show or hide them, feature them on the homepage, reorder them, view and export leads as CSV, edit homepage copy, and export or import JSON backups.

---

## Local development

```bash
cd E:\NEXTGEN
python -m http.server 8080
```

Then open <http://localhost:8080>. Use a server rather than opening the file directly — `fetch()` on `data/*.json` will not work over `file://`.

---

## Design notes

- Design tokens live at the top of `assets/css/style.css`. Change `--brand` and `--brand-2` and the whole site follows.
- `--grad` is deliberately reserved for the primary CTA and the logo mark. Spreading it across every element makes the CTA stop reading as "click this".
- Nav and footer are in `layout.js` only — edit them once, and every page updates.
- Add an icon by adding one entry to the `ICONS` object in `icons.js`, then using `data-icon="name"` anywhere.

### Deliberate content choices

- **No testimonials.** Fabricated reviews violate Meta's advertising policies and can get an ad account banned. Add real ones when you have them — there is a marked section on the homepage.
- **No invented metrics.** The hero shows the five real live domains a visitor can open and verify, rather than a mocked-up dashboard with made-up numbers.
- **No fake prices.** Cards show "Pricing on request" until you set a real `price` in the admin panel.

---

## Accessibility

The site was audited against WCAG 2.2 AA. Implemented: skip links, visible focus rings, keyboard-operable mobile menu with Escape support, screen-reader-announced form errors, a focus-trapped admin modal, labelled controls, breadcrumb landmarks, `prefers-reduced-motion` support, and contrast verified against the composited background rather than the flat token.

If you edit the CSS, keep `--text-faint` at or lighter than `#8A96B2` — anything darker fails 4.5:1 over the background glow.

---

## Tracking events

Once the Meta Pixel ID is set, the site fires:

| Event | When |
|-------|------|
| `PageView` | Every page load |
| `Lead` | A lead form is submitted successfully |
| `Contact` | A WhatsApp or phone link is clicked |

Build your Meta custom conversion on `Lead`.
