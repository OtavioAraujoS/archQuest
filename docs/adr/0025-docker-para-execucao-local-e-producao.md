# ADR-0025: Distribuir o app como imagem Docker, além do Netlify

- **Status**: Accepted
- **Data**: 2026-09-28

## Contexto

Rodar o archQuest exigia Node instalado (`npm run dev`) ou o deploy no Netlify
([ADR-0013](0013-ci-github-actions-e-deploy-netlify.md)). Queremos que qualquer pessoa suba
o app, inclusive em infraestrutura própria, só com Docker. O app é uma SPA estática e a
nuvem só liga quando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` existem no build
([ADR-0014](0014-supabase-como-backend.md)).

## Opções consideradas

1. **Envs como build args** — igual ao Netlify, sem mudar código; contras: trocar de
   projeto Supabase exige rebuild da imagem.
2. **Envs injetadas em runtime** (script no entrypoint gerando `env-config.js`) — uma
   imagem para qualquer ambiente; contras: muda `cloud-config.ts` e o `index.html` e cria
   um segundo caminho de configuração.

## Decisão

- `Dockerfile` multi-stage com Node 24: `deps` (`npm ci`), `dev` (Vite com `--host`),
  `build` (`npm run build`) e `runtime` (nginx servindo `dist/`).
- `docker/nginx.conf` replica o redirect de SPA do `netlify.toml`, com cache imutável em
  `/assets/` e `no-cache` no `index.html`.
- As variáveis do Supabase entram como build args (opção 1). Sem elas, modo convidado.
- `compose.yaml` com o serviço `web` (porta 8080) e o serviço `dev` no profile `dev`
  (porta 5173, código montado e polling de arquivos via `DOCKER_DEV=true`).
- O CI builda a imagem em cada PR. O Netlify continua sendo o deploy oficial.

## Consequências

- **Positivas**: o app roda sem Node local e pode ser hospedado em qualquer lugar que
  aceite containers.
- **Negativas**: a imagem é específica de um projeto Supabase; há duas configurações de
  SPA fallback (`netlify.toml` e `docker/nginx.conf`) para manter em sincronia.
- **Riscos e mitigações**: o `.dockerignore` exclui `.env*`, então segredos locais nunca
  entram no contexto de build; só a chave `anon`, que é pública, vai para o bundle.
  Redes com inspeção de HTTPS quebram o `npm ci`; o compose repassa o arquivo de
  `NODE_EXTRA_CA_CERTS` como build secret, que não fica em nenhuma camada da imagem.

## Relacionados

- ADR-0013
- ADR-0014
