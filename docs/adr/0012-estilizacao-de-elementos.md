# ADR-0012: Estilizar elementos com `setColor` e a extensão `archquest:textStyle`

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

Usuários querem customizar a cor de preenchimento/borda e a cor, o negrito, o itálico e
o sublinhado do texto de cada elemento. BPMN não tem conceito de texto rico.

## Decisão

- Preenchimento e borda via `modeling.setColor()`, nativo do bpmn-js, que usa os
  namespaces `bioc:`/`color:` já entendidos por outras ferramentas.
- As quatro propriedades de texto ficam numa extensão XML própria, `archquest:textStyle`
  (`src/components/editor/text-style-moddle.json`), renderizada por um `TextStyleRenderer`
  que decora o texto já desenhado pelo bpmn-js.

## Consequências

- **Positivas**: o restante do XML continua 100% interoperável; outras ferramentas
  ignoram a extensão desconhecida.
- **Negativas**: negrito/itálico/sublinhado só aparecem dentro do archQuest.
