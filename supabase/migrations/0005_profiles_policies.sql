-- Allow inserting own profile row
drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles for insert
to authenticated
with check (user_id = auth.uid());

-- Ensure update checks also enforce ownership
drop policy if exists "profiles_update_self_check" on public.profiles;
create policy "profiles_update_self_check"
on public.profiles for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
