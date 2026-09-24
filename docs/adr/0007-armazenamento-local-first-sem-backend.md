# ADR-0007: Armazenar diagramas localmente no IndexedDB, sem backend

- **Status**: Superseded por [ADR-0015](0015-nuvem-como-fonte-da-verdade.md)
- **Data**: 2026-09-23

## Contexto

No v1 o objetivo era um editor que abrisse e funcionasse sem conta nem servidor.

## Opções consideradas

1. **Backend desde o início** — permite compartilhar, mas exige conta e infraestrutura.
2. **Local-first no navegador** — zero infraestrutura, funciona offline.

## Decisão

Persistir tudo no IndexedDB do navegador via Dexie.js, sem backend.

## Consequências

- **Positivas**: nenhuma conta ou servidor necessário.
- **Negativas**: diagramas presos a um navegador/dispositivo; impossível compartilhar.
  Essa limitação motivou o [ADR-0015](0015-nuvem-como-fonte-da-verdade.md). O Dexie
  continua em uso como cache offline e como armazenamento do modo convidado
  ([ADR-0016](0016-modo-convidado-e-autenticacao.md)).
