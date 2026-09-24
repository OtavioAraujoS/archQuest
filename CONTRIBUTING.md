# Contribuindo com o archQuest

Obrigado pelo interesse em contribuir! Este guia cobre o básico para rodar o projeto
localmente e abrir um PR.

## Contexto do projeto

Antes de mexer em arquitetura, dê uma lida nos [ADRs](./docs/adr/README.md) — lá
estão as decisões já tomadas (motor BPMN, armazenamento, stack, escopo) e o raciocínio
por trás delas, incluindo as alternativas descartadas. Ajuda a evitar propor de novo algo
que já foi decidido conscientemente. Para propor uma mudança de arquitetura, abra um PR
com um novo ADR a partir do [template](./docs/adr/template.md).

## Rodando o projeto localmente

Setup completo e scripts disponíveis estão no [README](./README.md#rodando-localmente).
Resumindo:

```bash
npm install
npm run dev
```

Sem nenhuma variável de ambiente, o app roda em modo convidado, só no navegador. Para a
maior parte das mudanças (editor, paleta, templates, estilos) isso basta, e é assim que
o CI roda: nenhum teste depende do Supabase.

## Rodando com o Supabase local

Para mexer em login, sincronização, links públicos ou no banco, rode o Supabase no
Docker. A CLI já vem como dependência de desenvolvimento.

1. Com o Docker rodando, suba o Supabase local (na primeira vez ele baixa as imagens):

   ```bash
   npx supabase start
   ```

   Isso aplica as migrations de [`supabase/migrations/`](./supabase/migrations/) e usa a
   configuração de [`supabase/config.toml`](./supabase/config.toml).
2. Crie o `.env.local` a partir do exemplo e preencha com os valores de `API_URL` e
   `ANON_KEY` que aparecem em `npx supabase status`:

   ```bash
   cp .env.example .env.local
   ```

3. Rode `npm run dev`. Aparece o botão "Entrar".
4. Link mágico: os e-mails do Supabase local não saem da sua máquina; abra a caixa de
   entrada de teste em http://127.0.0.1:54324.
5. Login por GitHub (opcional): crie um OAuth App só para desenvolvimento, com a
   *Authorization callback URL* `http://127.0.0.1:54321/auth/v1/callback`, e adicione ao
   `supabase/config.toml`:

   ```toml
   [auth.external.github]
   enabled = true
   client_id = "env(SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID)"
   secret = "env(SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET)"
   ```

   As duas variáveis ficam em `supabase/.env`, que não vai para o git. Reinicie com
   `npx supabase stop` e `npx supabase start`.

Para desligar a nuvem de novo, apague o `.env.local` (ou deixe as variáveis em branco).

### Mudando o banco

- Crie uma migration nova com `npx supabase migration new <nome>`; não edite migrations
  que já foram aplicadas em produção.
- `npx supabase db reset` recria o banco local aplicando todas as migrations.
- `npx supabase test db` roda os testes pgTAP de
  [`supabase/tests/database/`](./supabase/tests/database/). Toda mudança de tabela,
  política de RLS ou função deve vir com testes ali, cobrindo o dono, outro usuário e o
  papel `anon`.
- Quem mantém o projeto aplica as migrations em produção com `npx supabase db push`.

## Antes de abrir um PR

Rode localmente os mesmos checks que o CI ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml))
vai rodar:

```bash
npm run lint
npm run build
npm test
```

Se a mudança tocar em `supabase/`, rode também `npx supabase db reset` e
`npx supabase test db` com o Supabase local.

Um PR só é revisado depois que esses três passam. Se algum falhar por um motivo que você
acha que não tem a ver com sua mudança, mencione isso na descrição do PR.

## Aviso sobre a licença do bpmn-js

O archQuest depende do [bpmn-js](https://bpmn.io/license/), cuja licença exige manter
visível a marca d'água "powered by bpmn.io" em qualquer diagrama renderizado. **Não
remova, oculte ou sobreponha essa marca d'água** em nenhuma mudança de UI ou de estilo
(veja `src/components/editor/bpmn-theme.css` para o que já é seguro customizar).

## Convenções de código

- Evite comentários no código — prefira nomes de função/variável que já expliquem o que
  está acontecendo. Comente só quando o *porquê* não for óbvio (uma decisão não-trivial,
  uma limitação de uma lib externa, etc.).
- Mantenha arquivos pequenos e coesos: se um arquivo está misturando responsabilidades
  diferentes (ex.: lógica de integração com uma lib externa + renderização de UI), separe
  em módulos — veja `src/components/editor/useBpmnEditor.ts` (lógica) vs.
  `BpmnEditor.tsx` (apresentação) como exemplo do padrão.
- Testes ficam em `__tests__/`, na raiz, espelhando as pastas de `src/`: o teste de
  `src/lib/db.ts` é `__tests__/lib/db.test.ts`. Importe o código testado pelo alias
  `@/` (inclusive em `vi.mock`). Helpers só de teste também ficam em `__tests__/`.
