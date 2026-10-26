-- ============================================================
-- ESSOR AUTOMATIONS — Blog / Posts schema (Phase 2: SEO content)
-- ------------------------------------------------------------
-- How to run this:
--   1. Supabase dashboard -> SQL Editor -> New query
--   2. Paste this whole file and press RUN
--   3. That's it — no env vars change, it reuses the existing
--      NEXT_PUBLIC_SUPABASE_URL / ANON_KEY already configured.
--
-- Safe to re-run: every statement is idempotent.
-- ============================================================

create table if not exists public.posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  excerpt          text,
  content          text,                       -- lightweight markdown (##, -, blank-line paragraphs)
  category         text,
  cover_image_url  text,
  seo_title        text,
  seo_description  text,
  published        boolean default true,
  featured         boolean default false,
  read_minutes     integer default 4,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index if not exists posts_created_idx on public.posts (created_at desc);
create index if not exists posts_published_idx on public.posts (published);

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY — same pattern as products/services:
-- anon may read published posts only, authenticated admins can
-- do everything. Run supabase-admin-lockdown.sql first if you
-- have not already (it restricts "authenticated" to your own
-- admin user id instead of anyone who signs up).
-- ------------------------------------------------------------
alter table public.posts enable row level security;

drop policy if exists "posts public read" on public.posts;
create policy "posts public read" on public.posts
  for select to anon using (published = true);

drop policy if exists "posts admin all" on public.posts;
create policy "posts admin all" on public.posts
  for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- STARTER POSTS — same three the site ships with in defaults.ts,
-- so switching Supabase on changes nothing visible until you edit.
-- ------------------------------------------------------------
insert into public.posts
  (slug, title, excerpt, content, category, seo_title, seo_description, read_minutes, published, featured)
values
  ('pharmacy-billing-software-india',
   'Pharmacy Billing Software in India: What to Actually Look for in 2025',
   'GST billing, batch-wise expiry tracking and stock alerts are not optional extras for a medical store anymore — here is what separates a real system from a glorified calculator.',
   '## Why counter speed is not the only thing that matters

Most medical store owners shop for billing software on one measure: how fast is it at the counter. That matters, but it is only half the job. The other half shows up a month later, when expiry write-offs eat into margin that counter speed never touched.

## The five things worth checking before you buy

- GST-ready invoices that do not need manual correction every time a rate changes
- Batch-wise stock tracking, not just a total quantity per item
- Expiry alerts early enough to return or discount stock before it is a write-off
- Supplier and purchase records that reconcile without a spreadsheet on the side
- Reports you can actually read in two minutes, not a data dump

## What this costs if you get it wrong

A chemist running three registers and one spreadsheet is not short on data — they are short on time. The real cost of weak billing software is not the subscription fee, it is the hours spent every week turning raw entries into something a GST filing or a bank loan application can use.

## Where DawaiStore fits

DawaiStore was built around exactly this list: GST billing, batch and expiry tracking, supplier management and online ordering in one dashboard. It exists because we watched pharmacy owners lose margin to expired stock they did not see coming in time — not because "pharmacy software" was a market gap.',
   'Healthcare',
   'Pharmacy Billing Software in India — What to Look for in 2025',
   'A practical checklist for choosing pharmacy billing software in India: GST billing, batch-wise expiry tracking, supplier management and real reporting.',
   5, true, true),

  ('whatsapp-crm-small-business',
   'Why Your Small Business Needs a WhatsApp CRM, Not Just a WhatsApp Number',
   'If every enquiry lives in one person''s phone, you do not have a sales process — you have a single point of failure. Here is what a real WhatsApp CRM changes.',
   '## The problem is not WhatsApp. It is doing it manually.

Indian customers message on WhatsApp before they call. That is not going to change. What does need to change is treating that channel as one employee''s personal inbox instead of a tracked, assigned, reportable sales channel.

## What breaks first

- Leads go cold because nobody follow-up after the first reply
- Two team members separately reply to the same customer with different answers
- There is no record of who promised what, or when
- Nobody can tell you the actual conversion rate from WhatsApp enquiry to sale

## What a shared WhatsApp CRM actually fixes

A shared team inbox means every chat is visible, assignable and has a history. Auto-replies keep a lead warm even outside business hours. And because every conversation becomes a trackable lead, you get a real number for cost per lead and conversion rate instead of a guess.

## Where ChatXFlow fits

ChatXFlow was built for exactly this: a no-code chatbot flow builder, bulk broadcast, a shared team inbox and automatic lead capture from every incoming chat. It is the same platform behind our own WhatsApp Marketing & Automation service — we use it before we sell it.',
   'Marketing Automation',
   'WhatsApp CRM for Small Business — Why a Shared Inbox Beats a Personal Number',
   'Why small businesses in India need a shared WhatsApp CRM instead of relying on one phone — lead tracking, auto-replies and conversion reporting explained.',
   4, true, true),

  ('erp-vs-spreadsheets-growing-business',
   'ERP vs. Spreadsheets: The Real Signal It Is Time to Switch',
   'Spreadsheets are not the enemy. The moment three people need to trust the same number at the same time, they become one.',
   '## The spreadsheet stage is normal

Every business starts on spreadsheets, and for a while that is the right call — cheap, flexible, and nobody needs permission to add a column. The problem is not that spreadsheets are bad. It is that they do not scale past one source of truth per person.

## The signals worth watching

- Purchase, sales and stock live in separate files that someone reconciles by hand
- Month-end reporting takes days because numbers have to be pulled from five places
- Two people have two different numbers for the same thing, and nobody is sure which is current
- A new hire needs a week of explanation before they can safely touch the sheet

## What actually changes with an ERP

The point of an ERP is not more features. It is one number, in one place, that purchase, sales, accounts and production all read from and write to. Real-time reports stop being a month-end project and become a screen anyone with the right access can open.

## Where PRO ERP fits

PRO ERP covers inventory, accounts and GST, purchase and sales, production planning and HR and payroll on one connected system, with role-based access so each department sees only what it needs. It is in active development with early access open now — book a free call if spreadsheets have started working against you instead of for you.',
   'ERP',
   'ERP vs Spreadsheets — When a Growing Business Should Switch',
   'The real signals that spreadsheets have stopped working for your business, and what an ERP system actually changes about reporting and data trust.',
   4, true, false)
on conflict (slug) do nothing;
