begin;
select plan(9);

insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'owner@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'intruder@example.com');

insert into public.diagrams (id, owner_id, name, bpmn_xml) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Privado', '<xml/>'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Publicado', '<xml/>');

update public.diagrams
  set public_slug = 'slugPublicoComEntropia01'
  where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

select results_eq(
  'select count(*)::int from public.diagrams',
  array[2],
  'owner reads their own diagrams'
);

select lives_ok(
  $$insert into public.diagrams (name, bpmn_xml) values ('Novo', '<xml/>')$$,
  'owner creates a diagram owned by themselves by default'
);

set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

select is_empty(
  'select id from public.diagrams',
  'another user reads no diagram, not even a published one'
);

select throws_ok(
  $$insert into public.diagrams (owner_id, name, bpmn_xml)
    values ('11111111-1111-1111-1111-111111111111', 'Invasor', '<xml/>')$$,
  '42501',
  null,
  'another user cannot create a diagram for the owner'
);

select lives_ok(
  $$update public.diagrams set name = 'Alterado'$$,
  'an update by another user runs but matches no row'
);

select lives_ok(
  $$delete from public.diagrams$$,
  'a delete by another user runs but matches no row'
);

reset role;

select results_eq(
  $$select count(*)::int from public.diagrams where name in ('Privado', 'Publicado')$$,
  array[2],
  'the owner diagrams survived the other user update and delete'
);

set local role anon;

select throws_ok(
  'select id from public.diagrams',
  '42501',
  null,
  'anon cannot list diagrams'
);

select throws_ok(
  $$update public.diagrams set name = 'Anonimo'$$,
  '42501',
  null,
  'anon cannot write diagrams'
);

select * from finish();
rollback;
