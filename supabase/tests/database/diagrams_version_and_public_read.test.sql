begin;
select plan(8);

insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'owner@example.com');

insert into public.diagrams (id, owner_id, name, bpmn_xml) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Processo', '<xml/>');

update public.diagrams set bpmn_xml = '<xml changed="true"/>', version = 99
  where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

select results_eq(
  $$select version from public.diagrams where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  array[2],
  'a content change increments the version, ignoring the version sent by the client'
);

update public.diagrams set public_slug = 'slugPublicoComEntropia01'
  where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

select results_eq(
  $$select version from public.diagrams where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  array[2],
  'publishing does not change the version'
);

select throws_ok(
  $$update public.diagrams set bpmn_xml = repeat('x', 2097153)
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  '23514',
  null,
  'XML above 2 MB is rejected'
);

select throws_ok(
  $$update public.diagrams set public_slug = 'curto'
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$,
  '23514',
  null,
  'a short, guessable slug is rejected'
);

set local role anon;

select results_eq(
  $$select name from public.get_public_diagram('slugPublicoComEntropia01')$$,
  $$values ('Processo')$$,
  'anon reads a published diagram by its slug'
);

select is_empty(
  $$select name from public.get_public_diagram('slugQueNaoExisteNoBanco01')$$,
  'an unknown slug returns nothing'
);

reset role;

update public.diagrams set public_slug = null
  where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

set local role anon;

select is_empty(
  $$select name from public.get_public_diagram('slugPublicoComEntropia01')$$,
  'unpublishing invalidates the old slug'
);

select is(
  pg_get_function_result('public.get_public_diagram(text)'::regprocedure),
  'TABLE(name text, bpmn_xml text, updated_at timestamp with time zone)',
  'the public result exposes only name, XML and last update, never the owner'
);

select * from finish();
rollback;
