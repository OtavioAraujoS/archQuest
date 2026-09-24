create table public.diagrams (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  bpmn_xml text not null,
  thumbnail text,
  version integer not null default 1,
  public_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint diagrams_name_length check (char_length(name) between 1 and 200),
  constraint diagrams_bpmn_xml_max_2mb check (octet_length(bpmn_xml) <= 2097152),
  constraint diagrams_thumbnail_max_2mb check (octet_length(thumbnail) <= 2097152),
  constraint diagrams_public_slug_format check (public_slug ~ '^[A-Za-z0-9_-]{22,}$')
);

create index diagrams_owner_id_updated_at_idx
  on public.diagrams (owner_id, updated_at desc);

create function public.bump_diagram_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.owner_id := old.owner_id;
  new.created_at := old.created_at;

  if (new.name, new.bpmn_xml, new.thumbnail)
     is distinct from (old.name, old.bpmn_xml, old.thumbnail) then
    new.version := old.version + 1;
    new.updated_at := now();
  else
    new.version := old.version;
    new.updated_at := old.updated_at;
  end if;

  return new;
end;
$$;

create trigger diagrams_bump_version
  before update on public.diagrams
  for each row execute function public.bump_diagram_version();
