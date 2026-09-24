create function public.get_public_diagram(requested_slug text)
returns table (name text, bpmn_xml text, updated_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select diagram.name, diagram.bpmn_xml, diagram.updated_at
  from public.diagrams as diagram
  where diagram.public_slug = requested_slug;
$$;

revoke execute on function public.get_public_diagram(text) from public, anon, authenticated;
grant execute on function public.get_public_diagram(text) to anon, authenticated;

revoke execute on function public.bump_diagram_version() from public, anon, authenticated;
