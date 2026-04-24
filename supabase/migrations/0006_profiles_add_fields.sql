alter table public.profiles
  add column if not exists gender text default 'secret',
  add column if not exists age integer,
  add column if not exists phone text;

create index if not exists profiles_phone_idx on public.profiles (phone);
