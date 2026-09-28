create table public.diagram_folders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint diagram_folders_name_length check (char_length(name) between 1 and 80),
  constraint diagram_folders_id_owner_unique unique (id, owner_id)
);

create index diagram_folders_owner_id_idx on public.diagram_folders (owner_id);

create function public.keep_diagram_folder_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.owner_id := old.owner_id;
  new.created_at := old.created_at;
  return new;
end;
$$;

create trigger diagram_folders_keep_owner
  before update on public.diagram_folders
  for each row execute function public.keep_diagram_folder_owner();

alter table public.diagram_folders enable row level security;

revoke all on table public.diagram_folders from anon;
grant select, insert, update, delete on table public.diagram_folders to authenticated;

create policy "Owners read their folders"
  on public.diagram_folders for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Owners create their folders"
  on public.diagram_folders for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Owners update their folders"
  on public.diagram_folders for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Owners delete their folders"
  on public.diagram_folders for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

alter table public.diagrams add column folder_id uuid;

alter table public.diagrams
  add constraint diagrams_folder_of_same_owner
  foreign key (folder_id, owner_id)
  references public.diagram_folders (id, owner_id)
  on delete set null (folder_id);

create index diagrams_folder_id_idx on public.diagrams (folder_id);
