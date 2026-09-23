# ADR-0009: Salvar em disco só via import/export manual

- **Status**: Superseded por [ADR-0019](0019-file-system-access-como-espelho.md)
- **Data**: 2026-09-23

## Contexto

A File System Access API permite abrir e salvar direto no disco, mas só existe em
navegadores baseados em Chromium.

## Decisão

No v1, apenas botões de importar `.bpmn` e exportar `.bpmn`/PNG/SVG, para garantir o
mesmo comportamento em todos os navegadores. A File System Access API ficou como possível
melhoria incremental.

## Consequências

- **Positivas**: compatibilidade universal.
- **Negativas**: cada salvamento em disco gera um download novo; sem "Ctrl+S no mesmo
  arquivo". Endereçado pelo [ADR-0019](0019-file-system-access-como-espelho.md).
