# ADR-0006: Manter um repositório único e web-first

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

Não há, no início, pacotes que justifiquem monorepo nem demanda por app desktop.

## Opções consideradas

1. **Monorepo** — prepara para vários pacotes, adiciona tooling sem necessidade atual.
2. **Projeto único** — simples; pode ser dividido quando surgir uma necessidade real.

## Decisão

Projeto único, sem monorepo, e plataforma web-first, sem app desktop/offline nativo.

## Consequências

- **Positivas**: setup trivial para contribuidores.
- **Negativas**: se surgir um backend próprio, será preciso reorganizar. Com o Supabase
  ([ADR-0014](0014-supabase-como-backend.md)) o backend vive em `supabase/` dentro do
  mesmo repositório, então a decisão continua válida.
