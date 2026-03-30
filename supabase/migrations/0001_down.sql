drop policy if exists "public_read_public_assets" on storage.objects;
drop policy if exists "manage_own_protected_assets" on storage.objects;

delete from storage.buckets where id in ('public-assets','protected-assets');

drop policy if exists "comments_crud_own" on public.comments;
drop policy if exists "comments_select_all" on public.comments;
drop policy if exists "posts_crud_own" on public.posts;
drop policy if exists "posts_select_all" on public.posts;
drop policy if exists "profiles_update_self" on public.profiles;
drop policy if exists "profiles_select_all" on public.profiles;

drop table if exists public.comments cascade;
drop table if exists public.posts cascade;
drop table if exists public.profiles cascade;
