-- ============================================================
-- ESSOR AUTOMATIONS — Supabase schema
-- ------------------------------------------------------------
-- How to run this:
--   1. Create a project at supabase.com
--   2. Left menu -> SQL Editor -> New query
--   3. Paste this whole file and press RUN
--   4. Settings -> API: copy the Project URL and the anon key into
--      NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
--      (Vercel > Settings > Environment Variables, and .env.local locally)
--   5. Authentication -> Users -> Add user: create your admin account
--      with "Auto Confirm User" switched ON
--
-- Safe to re-run: every statement is idempotent.
-- ============================================================

-- ------------------------------------------------------------
-- 1. PRODUCTS
-- ------------------------------------------------------------
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  name             text not null,
  tagline          text,
  category         text,
  status           text default 'live',        -- live | beta | soon
  url              text,
  logo_text        text,
  color_from       text default '#C60000',
  color_to         text default '#A30000',
  image_url        text,
  description      text,
  long_description text,
  features         jsonb default '[]'::jsonb,
  highlights       jsonb default '[]'::jsonb,
  price            text,
  old_price        text,
  price_note       text,
  published        boolean default true,
  featured         boolean default false,
  sort_order       integer default 99,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);
alter table public.products add column if not exists image_url text;

create index if not exists products_sort_idx on public.products (sort_order);
create index if not exists products_published_idx on public.products (published);

-- ------------------------------------------------------------
-- 2. SERVICES
-- ------------------------------------------------------------
create table if not exists public.services (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  name             text not null,
  tagline          text,
  category         text,
  icon             text default 'zap',
  color_from       text default '#C60000',
  color_to         text default '#A30000',
  image_url        text,
  description      text,
  long_description text,
  deliverables     jsonb default '[]'::jsonb,
  outcomes         jsonb default '[]'::jsonb,
  price            text,
  price_note       text,
  published        boolean default true,
  featured         boolean default false,
  sort_order       integer default 99,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);
alter table public.services add column if not exists image_url text;

create index if not exists services_sort_idx on public.services (sort_order);
create index if not exists services_published_idx on public.services (published);

-- ------------------------------------------------------------
-- 3. LEADS
-- ------------------------------------------------------------
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  phone      text,
  email      text,
  product    text,
  message    text,
  source     text,
  status     text default 'new',   -- new | contacted | qualified | won | lost
  created_at timestamptz default now()
);
alter table public.leads add column if not exists status text default 'new';

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- ------------------------------------------------------------
-- 4. SETTINGS — one JSON row, so copy changes need no migrations
-- ------------------------------------------------------------
create table if not exists public.settings (
  id         integer primary key,
  data       jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

insert into public.settings (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 5. updated_at auto-touch
-- ------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists services_touch on public.services;
create trigger services_touch before update on public.services
  for each row execute function public.touch_updated_at();

drop trigger if exists settings_touch on public.settings;
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 6. ROW LEVEL SECURITY
--    The anon key ships in the browser, so these policies are what
--    actually protect the data — not the key.
-- ============================================================
alter table public.products enable row level security;
alter table public.services enable row level security;
alter table public.leads    enable row level security;
alter table public.settings enable row level security;

-- ---- PRODUCTS ----
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select to anon using (published = true);

drop policy if exists "products admin all" on public.products;
create policy "products admin all" on public.products
  for all to authenticated using (true) with check (true);

-- ---- SERVICES ----
drop policy if exists "services public read" on public.services;
create policy "services public read" on public.services
  for select to anon using (published = true);

drop policy if exists "services admin all" on public.services;
create policy "services admin all" on public.services
  for all to authenticated using (true) with check (true);

-- ---- LEADS ----
-- Anyone may submit one...
drop policy if exists "leads public insert" on public.leads;
create policy "leads public insert" on public.leads
  for insert to anon with check (true);

-- ...but only a signed-in admin can read them back. anon is deliberately
-- given no SELECT policy at all, so the enquiry list is not public.
drop policy if exists "leads admin read" on public.leads;
create policy "leads admin read" on public.leads
  for select to authenticated using (true);

drop policy if exists "leads admin update" on public.leads;
create policy "leads admin update" on public.leads
  for update to authenticated using (true) with check (true);

drop policy if exists "leads admin delete" on public.leads;
create policy "leads admin delete" on public.leads
  for delete to authenticated using (true);

-- ---- SETTINGS ----
drop policy if exists "settings public read" on public.settings;
create policy "settings public read" on public.settings
  for select to anon using (true);

drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings
  for all to authenticated using (true) with check (true);

-- ============================================================
-- 7. STARTER DATA
--    Matches what the site already shows from its seed content, so
--    switching Supabase on changes nothing visible until you edit.
-- ============================================================
insert into public.products
  (slug, name, tagline, category, status, url, logo_text, color_from, color_to,
   description, features, published, featured, sort_order)
values
  ('chatxflow','ChatXFlow','WhatsApp & Omnichannel Chat Automation','Marketing Automation','live',
   'https://chatxflow.online','CX','#25D366','#0EA5E9',
   'Handle WhatsApp and every other chat channel from one shared inbox. Chatbot flows, bulk broadcasts, auto-replies and lead capture in a single place.',
   '["Chatbot Flow Builder","Bulk Broadcast","Shared Team Inbox","Auto Reply","Lead Capture","Campaign Reports"]'::jsonb,
   true,true,1),

  ('dawaistore','DawaiStore','Pharmacy & Medical Store Management','Healthcare','live',
   'https://dawaistore.online','DS','#34D399','#10B981',
   'Complete billing, inventory and expiry tracking for medical stores — with online ordering built in.',
   '["GST Billing","Batch & Expiry Tracking","Stock Alerts","Supplier Management","Online Ordering","Sales Reports"]'::jsonb,
   true,true,2),

  ('panelsuite','PanelSuite','All-in-One Service Panel Platform','SaaS Platform','live',
   'https://panelsuite.online','PS','#A855F7','#5B7CFF',
   'Launch your own service panel — orders, wallet, users and automated delivery all included.',
   '["User & Wallet System","Order Automation","Reseller Access","Payment Gateway","Ticket Support","Admin Analytics"]'::jsonb,
   true,true,3),

  ('autolyst','Autolyst','Workflow & Task Automation','Automation','live',
   'https://autolyst.online','AU','#22D3EE','#34D399',
   'Automate repetitive work — connect your apps, set triggers, and give your team its time back.',
   '["Trigger & Action Builder","App Integrations","Scheduled Jobs","Conditional Logic","Error Alerts","Run History"]'::jsonb,
   true,true,4),

  ('admetics','Admetics','Ad Performance & Marketing Analytics','Analytics','live',
   'https://admetics.online','AD','#F87171','#A855F7',
   'Every ad account in one dashboard — spend, leads, cost per lead and ROAS, in real time.',
   '["Unified Ad Dashboard","Cost Per Lead Tracking","ROAS Reports","Campaign Comparison","Auto Report Scheduling","Client Sharing"]'::jsonb,
   true,true,5),

  ('essor-crm','Essor CRM','Sales CRM & Lead Pipeline','Sales','soon',
   null,'CR','#F59E0B','#F87171',
   'From first enquiry to closed deal — your whole sales pipeline in one place, with follow-up reminders built in.',
   '["Lead Pipeline","Follow-up Reminders","Call & Note Logs","Quotation Tracking","Team Performance","WhatsApp & Email Sync"]'::jsonb,
   true,false,6),

  ('pro-erp','PRO ERP','Complete Business ERP','ERP','soon',
   null,'PE','#5B7CFF','#22D3EE',
   'Inventory, accounts, purchase, sales, HR and production — your entire business on one system.',
   '["Inventory & Warehouse","Accounts & GST","Purchase & Sales","Production Planning","HR & Payroll","Role-based Access"]'::jsonb,
   true,false,7)
on conflict (slug) do nothing;

insert into public.services
  (slug, name, tagline, category, icon, color_from, color_to, description, deliverables,
   price_note, published, featured, sort_order)
values
  ('meta-ads-management','Meta Ads Management','Facebook & Instagram ads that bring enquiries, not just likes','Paid Advertising','target','#C60000','#A30000',
   'End-to-end Facebook and Instagram advertising — from audience research and creative production to daily optimisation and honest reporting.',
   '["Ad account and Business Manager setup","Pixel and conversion tracking installation","Audience research and targeting strategy","Ad creative design and copywriting","Campaign launch and daily optimisation","Weekly report with cost per lead"]'::jsonb,
   'Monthly retainer + ad spend. Quoted after a free audit.', true, true, 1),

  ('google-ads-management','Google Ads Management','Catch customers at the exact moment they are searching','Paid Advertising','chart','#A30000','#C60000',
   'Search, Performance Max and YouTube campaigns built around high-intent keywords — with wasted spend cut out through disciplined negative keyword work.',
   '["Keyword research and competitor analysis","Search, Shopping and Performance Max setup","Conversion and call tracking","Ad copy and extensions","Weekly search term review","Landing page recommendations"]'::jsonb,
   'Monthly retainer + ad spend. Quoted after a free audit.', true, true, 2),

  ('whatsapp-marketing-setup','WhatsApp Marketing & Automation','Turn your busiest channel into a system that never drops a lead','Marketing Automation','chat','#25D366','#0EA5E9',
   'WhatsApp Business API setup, chatbot flows, broadcast campaigns and a shared team inbox — powered by our own ChatXFlow platform.',
   '["WhatsApp Business API and number verification","Chatbot and auto-reply flow design","Broadcast setup and template approval","Shared team inbox with agent routing","CRM and lead capture integration","Team training and handover"]'::jsonb,
   'One-time setup + monthly platform fee', true, true, 3),

  ('landing-page-development','Landing Pages & Websites','Fast, conversion-focused pages built to receive paid traffic','Web Development','zap','#C60000','#F80000',
   'High-converting landing pages and business websites — fast-loading, mobile-first, and wired for conversion tracking from day one.',
   '["Conversion-focused structure and copywriting","Custom design matched to your brand","Mobile-first responsive build","Pixel, GA4 and conversion events","Core Web Vitals optimisation","Hosting setup and go-live support"]'::jsonb,
   'Fixed project price. Quoted after scoping.', true, true, 4),

  ('creative-design','Ad Creative & Branding','The creative decides whether your ad gets scrolled past','Creative','sliders','#F80000','#A30000',
   'Scroll-stopping static and video ad creative, plus the brand basics — logo, colours and templates — that make everything look like one company.',
   '["Static creative in all placement sizes","Short-form video and reel editing","Ad copy variations for testing","Logo and brand identity basics","Reusable social media templates","Monthly creative refresh"]'::jsonb,
   'Per-project or bundled with an ads retainer', true, false, 5),

  ('seo-and-content','SEO & Content','Traffic that keeps coming after you stop paying for it','Organic Growth','refresh','#0B7A43','#34D399',
   'Technical SEO, local search and content that builds a traffic source you own — so you are not dependent on ad spend forever.',
   '["Technical SEO audit and fixes","Keyword research and content plan","On-page optimisation","Google Business Profile and local SEO","Content writing and publishing","Monthly ranking and traffic report"]'::jsonb,
   'Monthly retainer, minimum 6 months', true, false, 6),

  ('custom-software-development','Custom Software Development','When nothing off the shelf fits how you actually work','Development','tool','#8A5200','#C60000',
   'Custom web applications, dashboards, integrations and automations — built by the same team that built and runs our own products.',
   '["Requirement mapping and technical scoping","Custom web application development","Third-party API and payment integrations","Reporting dashboards","Deployment, hosting and monitoring","Ongoing maintenance and support"]'::jsonb,
   'Fixed price per milestone, after scoping', true, false, 7)
on conflict (slug) do nothing;
