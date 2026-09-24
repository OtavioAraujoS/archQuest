alter table public.diagrams enable row level security;

revoke all on table public.diagrams from anon;
grant select, insert, update, delete on table public.diagrams to authenticated;

create policy "Owners read their diagrams"
  on public.diagrams for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Owners create their diagrams"
  on public.diagrams for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Owners update their diagrams"
  on public.diagrams for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Owners delete their diagrams"
  on public.diagrams for delete
  to authenticated
  using ((select auth.uid()) = owner_id);
