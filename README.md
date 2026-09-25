# Essor Automations

Marketing site and admin panel for Essor Automations — `essorautomations.com`.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Vercel.

---

## Running it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

The site works immediately with no configuration. Until Supabase is connected it
reads the seed content in `src/lib/defaults.ts`, so every page renders and the
admin is browsable — it just cannot save anything, and says so.

---

## Connecting Supabase

The admin needs this before it can store anything.

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → paste all of `supabase-schema.sql` → **Run**.
   It creates the tables, the Row Level Security policies and the starter rows,
   and is safe to run more than once.
3. **Authentication → Users → Add user** — create your admin login with
   **Auto Confirm User** switched on. That email and password is what
   `/admin/login` accepts. Copy the **User UID** shown afterwards.
4. **Authentication → Sign In / Providers → Email** → switch
   **"Allow new users to sign up"** **off**. Left on, a stranger can create
   themselves an account on your project.
5. **SQL Editor** → run `supabase-admin-lockdown.sql`, with the UID from step 3
   in its `insert into public.admins` line. Do not skip this — see below.
6. **SQL Editor** → run `supabase-storage.sql`. This creates the `media`
   bucket the admin uploads screenshots into: public to read, writable only by
   the same admin allow-list. It calls `is_admin()`, so it must run after
   step 5.
7. **Settings → API** → copy the **Project URL** and the **anon** key.
8. Put them in `.env.local` for local work, and in
   **Vercel → Settings → Environment Variables** for production:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   NEXT_PUBLIC_SITE_URL=https://essorautomations.com
   ```

The anon key is meant to be public; it ships in the browser on every Supabase
site. What actually protects the data is Row Level Security, and two rules do
the work. `anon` can *insert* a lead but has no `select` policy at all, so the
enquiry list cannot be read by the public. And after the lockdown script, the
admin policies test membership of the `admins` table rather than merely that
the request is logged in — granting to `authenticated` on its own is not a
control, because "authenticated" includes anybody who signed themselves up.

To add another admin later, create the user, then insert their UID into
`public.admins`. To revoke one, delete the row — the account can still log in
but will see nothing.

Never put the **service_role** (secret) key anywhere in this project. It
bypasses RLS completely and nothing here needs it.

---

## Deploying to Vercel

1. Push to GitHub.
2. Vercel → **Add New → Project** → import the repo. The framework is detected;
   no build settings need changing.
3. Add the environment variables above (all three environments).
4. **Settings → Domains** → add `essorautomations.com`, then point the domain's
   nameservers or A/CNAME records at Vercel as it instructs.

Every push to `main` deploys automatically. Pull requests get preview URLs.

---

## The admin panel

`/admin`, protected by `src/proxy.ts` — an unauthenticated request to anything
under `/admin` is redirected to the login.

| Page | What it controls |
|---|---|
| Dashboard | New-lead count, product and service counts, five most recent leads |
| Products | Full CRUD: copy, features, highlights, pricing, stripe colours, visibility, order |
| Services | Full CRUD: copy, deliverables, outcomes, icon, pricing, visibility, order |
| Leads | Search, status (new → contacted → qualified → won/lost), CSV export, click-to-WhatsApp |
| Settings | Contact details, social links, hero copy, trust band, audience chips, CTA band, FAQ, SEO, tracking IDs |

Saving calls `revalidatePath("/", "layout")`, so a change appears on the public
site on the next request rather than waiting for a rebuild.

---

## Things worth knowing before changing them

**The WhatsApp number is load-bearing.** `settings.contact.whatsapp` drives every
green button on the site. It must be digits only with the country code and no
`+` or spaces (`919311432603`). Wrong here means every enquiry silently goes
nowhere.

**Red is rationed deliberately.** At most one filled red element per viewport, so
the primary call to action keeps its emphasis. That is why product and service
cards use the green WhatsApp action, why filter chips and the nav CTA are
neutral or green, and why each item's own colour is a 3px stripe rather than a
56px tile — a grid of saturated tiles on white reads as a rainbow.

**Colour values are contrast-checked, not chosen by eye.** `#C60000` is 6.17:1 on
white for fills and red text; `#A30000` is 8.21:1 for links and focus; `#F80000`
is 4.21:1 and is legal *only* as a graphic, never as text. Muted text is
`#616A78` rather than the usual `#6B7280`, which passes on white but drops to
4.35:1 on the alternating band where those labels actually sit. The dark footer
and CTA slabs use the separate `--ink-*` tokens, because `--muted-foreground` is
3.52:1 against them and fails.

**No testimonials and no prices, on purpose.** Neither has been invented. The
trust the site does have comes from five products live at real domains that a
visitor can open and check in one tap, which is why the hero proof card and the
product cards lead with the domain. If you add testimonials later, use real ones
— fabricated reviews are a Meta Ads policy violation as well as a lie.

**Screenshots are the proof, so they are worth the upload path.** Products and
services each take one image, uploaded from the admin straight to Supabase
Storage and stored as a public URL. It is a real upload rather than a URL field
because "host it somewhere and paste a link" is not a thing the person running
this site should have to do. `next.config.ts` pins the allowed image host to
the project's own Supabase hostname rather than `**.supabase.co`, so nobody can
point an `image_url` at their own project and use this site's optimiser. The
cards and detail pages crop with `object-top`: a UI screenshot carries its
meaning in the top bar and the first rows, and centring crops away exactly that.

**Tracking is off until an ID is entered.** The Meta Pixel, GA4 and Google Ads
tags are driven from Settings, not from environment variables, so an ID can be
added without a redeploy — and an empty field means that script is never loaded
and no cookie is set. They render inside the public layout only, so admin
traffic never reaches the ad platforms. The `Lead` event fires when the enquiry
form *succeeds*, not when it is submitted: a failed or rejected submission is
not a lead, and counting it teaches Meta to go looking for the wrong people.

**The trust band takes three numbers, not four.** Each is checkable. A padded
fourth costs more trust with this audience than the symmetry is worth.

---

## Layout

```
src/
├─ app/
│  ├─ (site)/          public pages, share a layout with header/footer
│  ├─ admin/           admin panel, guarded by proxy.ts
│  ├─ actions/         server actions: lead.ts (public), admin.ts (authenticated)
│  ├─ sitemap.ts       generated from live products and services
│  └─ robots.ts
├─ components/
│  ├─ site/            hero, cards, brand moment, forms
│  ├─ admin/           editors, tables, nav
│  └─ ui/              shadcn primitives
├─ lib/
│  ├─ data.ts          read layer — Supabase with a seed-content fallback
│  ├─ defaults.ts      the seed content
│  ├─ types.ts
│  └─ supabase/        browser, server and proxy clients
└─ proxy.ts            auth guard

legacy-static/         the previous hand-built static site, kept for reference
```

## Credits

The hero mesh-gradient shader was adapted from a
[21st.dev](https://21st.dev) component by `zerotherm27-create`.
