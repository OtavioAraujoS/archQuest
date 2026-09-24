# archQuest

Modelagem de processos de negócio (BPMN 2.0) com a facilidade de uso de um
whiteboard. Pense: a robustez do Bizagi, com a simplicidade do Whimsical.

Projeto open-source, licenciado sob MIT.

## O que dá para fazer

- Modelar em BPMN 2.0 real: eventos de mensagem e timer, gateways, tarefas e
  sub-processos, com painel de propriedades e estilos de texto.
- Começar de um template ou de um diagrama em branco; importar e exportar `.bpmn`, PNG e
  SVG.
- **Sem conta (modo convidado):** tudo fica salvo neste navegador, no IndexedDB.
- **Com conta (opcional):** login por GitHub ou link mágico por e-mail, diagramas salvos
  na nuvem e disponíveis em outros dispositivos, edição offline com sincronização, e
  links públicos só de leitura em `/view/<slug>`.

## Stack

- [bpmn-js](https://github.com/bpmn-io/bpmn-js) — motor de renderização/edição BPMN 2.0
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Dexie (IndexedDB) como armazenamento local e cache offline
- [Supabase](https://supabase.com) (opcional) — autenticação, Postgres com RLS e links
  públicos
- Zustand para o estado de sessão e de sincronização

As decisões de arquitetura estão documentadas nos [ADRs](./docs/adr/README.md).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:5173. Sem configurar nada, o app roda em **modo convidado**: não
aparece login, nenhum código do Supabase é carregado e os diagramas ficam só neste
navegador. É assim que o CI roda.

### Habilitando a nuvem

A nuvem liga quando as duas variáveis abaixo existem. Copie o exemplo e preencha:

```bash
cp .env.example .env.local
```

| Variável | Onde encontrar |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → chave `anon` (pública) |

A chave `anon` é pública por natureza: o que protege os dados são as políticas de RLS em
[`supabase/migrations/`](./supabase/migrations/). Nunca use a chave `service_role` no
frontend.

Para usar um projeto Supabase próprio:

1. Crie o projeto e aplique as migrations:
   `npx supabase login`, `npx supabase link --project-ref <ref>` e `npx supabase db push`.
2. Em **Authentication → URL Configuration**, defina a *Site URL* do app e adicione às
   *Redirect URLs* `http://localhost:5173/**` e a URL do deploy (com `/**`).
3. Login por GitHub: crie um **OAuth App** (não um GitHub App) em GitHub → Settings →
   Developer settings, com a *Authorization callback URL*
   `https://<ref>.supabase.co/auth/v1/callback`, e cole o Client ID e o Client Secret em
   **Authentication → Sign In / Providers → GitHub**.
4. Link mágico: o provider de e-mail já vem ligado; para produção, configure um SMTP
   próprio, porque o padrão do Supabase envia poucos e-mails por hora.

Para rodar tudo localmente, com o Supabase no Docker, veja o
[CONTRIBUTING](./CONTRIBUTING.md#rodando-com-o-supabase-local).

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção (`dist/`)
- `npm run preview` — serve o build de produção localmente
- `npm run lint` — roda o oxlint
- `npm test` — roda os testes (Vitest)
- `npx supabase test db` — roda os testes de banco (pgTAP) no Supabase local

## Deploy

O deploy é no Netlify ([`netlify.toml`](./netlify.toml)), com redirect de SPA para as
rotas `/editor/:id`, `/view/:slug` e `/auth/callback`. Para ter a nuvem em produção,
cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em **Site configuration →
Environment variables** e faça um novo deploy (o Vite embute as variáveis no build).

## Aviso de licença

Este projeto depende do [bpmn-js](https://bpmn.io/license/), cuja licença exige manter
visível a marca d'água "powered by bpmn.io" nos diagramas renderizados, inclusive na
página pública. Não a remova.

## Contribuindo

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para o checklist antes de abrir um PR.
