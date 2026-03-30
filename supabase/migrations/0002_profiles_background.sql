alter table public.profiles
  add column if not exists background_url text default '';

create index if not exists profiles_username_idx on public.profiles (username);
