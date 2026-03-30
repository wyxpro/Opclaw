create or replace function public.get_email_by_username(p_username text)
returns text
language sql
security definer
as $$
  select email from public.profiles where username = p_username limit 1;
$$;

revoke all on function public.get_email_by_username(text) from public;
grant execute on function public.get_email_by_username(text) to anon, authenticated;
