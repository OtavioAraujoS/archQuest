# ADR-0011: Oferecer tema claro/escuro derivado dos tokens do Tailwind

- **Status**: Accepted (preenchimento das formas substituído pelo [ADR-0024](0024-canvas-escuro-no-tema-escuro.md))
- **Data**: 2026-09-23

## Decisão

- Toggle manual persistido em `localStorage`, com detecção de `prefers-color-scheme` no
  primeiro acesso; o tema é a classe `.dark` na raiz do documento.
- O "chrome" do bpmn-js (paleta, context-pad, popups) é retemado redefinindo apenas as
  variáveis `--bio-*` para apontar para os tokens de `src/index.css`, escopadas em
  `.archquest-bpmn` (`src/components/editor/bpmn-theme.css`).
- O preenchimento das formas BPMN continua branco nos dois modos, por convenção de
  notação e legibilidade dos exports.

## Consequências

- **Positivas**: uma única fonte de cores para app e editor.
- **Negativas**: elementos com estilo inline do bpmn-js (ex.: editor de rótulo com fundo
  `#ffffff`) precisam de overrides pontuais no modo escuro.
