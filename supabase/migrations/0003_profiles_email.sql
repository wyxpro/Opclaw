alter table public.profiles
  add column if not exists email text;

create unique index if not exists profiles_email_unique_idx on public.profiles (email);
