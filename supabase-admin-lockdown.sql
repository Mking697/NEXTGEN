-- ============================================================
-- ESSOR AUTOMATIONS — admin lockdown
-- ------------------------------------------------------------
-- Run this in the Supabase SQL Editor AFTER supabase-schema.sql.
-- Safe to re-run.
--
-- WHY THIS EXISTS
-- The first schema granted full access to the `authenticated` role:
--   create policy ... for all to authenticated using (true)
-- That is fine only if you are the sole account. But Supabase leaves
-- public signup ON by default, and the anon key is public by design, so
-- anyone could sign themselves up and inherit full read/write over your
-- products, services and every lead.
--
-- Turning signup off in the dashboard fixes it, but it is a single toggle
-- that can be switched back on by accident. This makes the database itself
-- the thing that enforces it: access is granted to a named allow-list, not
-- to "anyone who is logged in". Both together is the right answer.
-- ============================================================

-- ------------------------------------------------------------
-- 1. The allow-list
-- ------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz default now()
);

alter table public.admins enable row level security;

-- An admin may see their own row. Nobody else sees anything, so the list
-- of who has access is not itself readable.
drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ------------------------------------------------------------
-- 2. The check
-- ------------------------------------------------------------
-- security definer so the function can read public.admins regardless of the
-- caller's own RLS; search_path is pinned so it cannot be hijacked by a
-- shadowing table in another schema.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------------
-- 3. Seed the first admin
-- ------------------------------------------------------------
insert into public.admins (user_id, email)
values ('902f9339-4428-4593-8f28-b5a6820dd619', 'manojtiwari8428@gmail.com')
on conflict (user_id) do nothing;

-- To add another admin later: create the user in Authentication -> Users,
-- copy their UID, and insert a row here. To revoke access, delete the row —
-- the account can still exist and still log in, but it will see nothing.

-- ------------------------------------------------------------
-- 4. Replace the blanket `authenticated` policies
-- ------------------------------------------------------------

-- ---- PRODUCTS ----
-- public read stays exactly as it was: anon sees published rows only
drop policy if exists "products admin all" on public.products;
create policy "products admin all" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- SERVICES ----
drop policy if exists "services admin all" on public.services;
create policy "services admin all" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- LEADS ----
-- The public insert policy is untouched: the contact form must keep working
-- for people who are not logged in. Only reading and changing tightens.
drop policy if exists "leads admin read" on public.leads;
create policy "leads admin read" on public.leads
  for select to authenticated using (public.is_admin());

drop policy if exists "leads admin update" on public.leads;
create policy "leads admin update" on public.leads
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "leads admin delete" on public.leads;
create policy "leads admin delete" on public.leads
  for delete to authenticated using (public.is_admin());

-- ---- SETTINGS ----
drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- 5. Remove the setup test rows
-- ------------------------------------------------------------
-- Two leads were inserted while proving the connection and the RLS rules
-- worked. They are not real enquiries and should not sit in your inbox.
delete from public.leads where source in ('setup-test', 'rls-probe');

-- ------------------------------------------------------------
-- 6. Check it worked
-- ------------------------------------------------------------
select
  (select count(*) from public.admins)                        as admins_listed,
  (select count(*) from pg_policies
     where schemaname = 'public'
       and qual like '%is_admin%')                            as policies_using_allow_list;
-- Expect: admins_listed = 1, policies_using_allow_list = 6
