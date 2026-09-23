# ADR-0014: Usar Supabase como backend

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

A parte 2 exige salvar diagramas na nuvem para que outras pessoas possam visualizá-los.
Precisamos de banco, autenticação e acesso público controlado, com o mínimo de
infraestrutura para manter num projeto open-source.

## Opções consideradas

1. **Supabase** — Postgres + Auth + RLS num só serviço; open-source e auto-hospedável;
   plano gratuito.
2. **Firebase** — equivalente em recursos, mas proprietário e com lock-in.
3. **Netlify Functions + Netlify Blobs** — mesmo provedor do deploy, mas sem auth pronta e
   com banco limitado.
4. **Backend próprio (Node + Postgres)** — controle total, muito mais código e operação.

## Decisão

Usar Supabase:
- Schema e políticas versionados em `supabase/migrations/`, aplicáveis com a Supabase CLI.
- Row Level Security: o dono lê e escreve seus diagramas; o papel `anon` só lê um diagrama
  publicado, pelo slug.
- Thumbnail guardada numa coluna da tabela, sem usar o Storage.
- Limite de 2 MB de XML por diagrama, validado no cliente e numa constraint `CHECK` no
  banco. Sem limite de quantidade por conta, por enquanto.
- Cliente configurado por `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

## Consequências

- **Positivas**: auth, banco e regras de acesso sem servidor próprio; forks podem subir
  a própria instância.
- **Negativas**: dependência de um serviço externo e dos limites do plano gratuito; a
  criação do projeto e as chaves ficam fora do repositório.
- **Riscos**: RLS mal escrita expõe diagramas privados. Mitigação: políticas revisadas
  em PR e testadas contra um banco local da Supabase CLI.

## Relacionados

- [ADR-0015](0015-nuvem-como-fonte-da-verdade.md)
- [ADR-0016](0016-modo-convidado-e-autenticacao.md)
