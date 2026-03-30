create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  avatar_url text,
  bio text default '',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  attachments jsonb default '[]'::jsonb,
  likes integer not null default 0,
  comments_count integer not null default 0,
  shares integer not null default 0,
  created_at timestamp with time zone default now() not null
);

create index if not exists posts_author_idx on public.posts (author_id);
create index if not exists posts_created_idx on public.posts (created_at desc);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  likes integer not null default 0,
  parent_id uuid null references public.comments (id) on delete set null,
  created_at timestamp with time zone default now() not null
);

create index if not exists comments_post_idx on public.comments (post_id);
create index if not exists comments_author_idx on public.comments (author_id);
create index if not exists comments_created_idx on public.comments (created_at desc);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
drop policy if exists "profiles_update_self" on public.profiles;
drop policy if exists "posts_select_all" on public.posts;
drop policy if exists "posts_crud_own" on public.posts;
drop policy if exists "comments_select_all" on public.comments;
drop policy if exists "comments_crud_own" on public.comments;

create policy "profiles_select_all"
on public.profiles for select
to authenticated
using (true);

create policy "profiles_update_self"
on public.profiles for update
to authenticated
using (auth.uid() = user_id);

create policy "posts_select_all"
on public.posts for select
to authenticated
using (true);

create policy "posts_crud_own"
on public.posts for all
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

create policy "comments_select_all"
on public.comments for select
to authenticated
using (true);

create policy "comments_crud_own"
on public.comments for all
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('public-assets','public-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('protected-assets','protected-assets', false)
on conflict (id) do nothing;

drop policy if exists "public_read_public_assets" on storage.objects;
drop policy if exists "manage_own_protected_assets" on storage.objects;

create policy "public_read_public_assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'public-assets');

create policy "manage_own_protected_assets"
on storage.objects for all
to authenticated
using (
  bucket_id = 'protected-assets'
  and (owner = auth.uid() or (storage.foldername(name))[1] = auth.uid()::text)
)
with check (
  bucket_id = 'protected-assets'
  and (owner = auth.uid() or (storage.foldername(name))[1] = auth.uid()::text)
);
