begin;
select plan(7);

insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'owner@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'intruder@example.com');

insert into public.diagram_folders (id, owner_id, name) values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Onboarding');

insert into public.diagrams (id, owner_id, name, bpmn_xml, folder_id) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Na pasta', '<xml/>', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

select results_eq(
  'select count(*)::int from public.diagram_folders',
  array[1],
  'owner reads their own folders'
);

select lives_ok(
  $$insert into public.diagram_folders (name) values ('Financeiro')$$,
  'owner creates a folder owned by themselves by default'
);

set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

select is_empty(
  'select id from public.diagram_folders',
  'another user reads no folder'
);

select throws_ok(
  $$insert into public.diagrams (name, bpmn_xml, folder_id)
    values ('Invasor', '<xml/>', 'cccccccc-cccc-cccc-cccc-cccccccccccc')$$,
  '23503',
  null,
  'another user cannot put a diagram in the owner folder'
);

select lives_ok(
  $$delete from public.diagram_folders$$,
  'a delete by another user runs but matches no row'
);

reset role;

select results_eq(
  'select count(*)::int from public.diagram_folders where owner_id = ''11111111-1111-1111-1111-111111111111''',
  array[2],
  'the owner folders survived the other user delete'
);

delete from public.diagram_folders where id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

select results_eq(
  $$select count(*)::int from public.diagrams
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      and folder_id is null
      and owner_id = '11111111-1111-1111-1111-111111111111'$$,
  array[1],
  'deleting a folder keeps its diagrams, now outside any folder'
);

select * from finish();
rollback;
