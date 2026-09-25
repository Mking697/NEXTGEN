-- ============================================================
-- ESSOR AUTOMATIONS — image storage
-- ------------------------------------------------------------
-- Run in the Supabase SQL Editor AFTER supabase-admin-lockdown.sql,
-- because the write policies below call public.is_admin(), which that
-- file creates. Safe to re-run.
--
-- This gives the admin panel somewhere to put product and service
-- screenshots. Reads are public, because the images appear on the public
-- site; writes are restricted to the same admin allow-list as everything
-- else, so a stranger who signs up cannot upload into your bucket.
-- ============================================================

-- A public bucket: anyone may fetch an image by URL, nobody may list or
-- write without passing is_admin().
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true,
  5242880,   -- 5 MB; a UI screenshot has no business being larger
  array['image/png','image/jpeg','image/webp','image/avif']
)
on conflict (id) do update set
  public             = true,
  file_size_limit    = 5242880,
  allowed_mime_types = array['image/png','image/jpeg','image/webp','image/avif'];

drop policy if exists "media public read"   on storage.objects;
create policy "media public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- Check
select
  (select count(*) from storage.buckets where id = 'media')            as bucket_exists,
  (select count(*) from pg_policies
     where schemaname = 'storage' and tablename = 'objects'
       and policyname like 'media %')                                  as media_policies;
-- Expect: bucket_exists = 1, media_policies = 4
