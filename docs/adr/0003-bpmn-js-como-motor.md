# ADR-0003: Usar bpmn-js como motor de diagrama

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

Renderizar, editar e serializar BPMN 2.0 do zero é um projeto inteiro por si só.

## Opções consideradas

1. **Motor gráfico próprio** — controle total, custo enorme.
2. **[bpmn-js](https://github.com/bpmn-io/bpmn-js)** (Camunda/bpmn.io) — maduro,
   extensível via módulos, já cobre renderização, edição e XML.

## Decisão

Usar o bpmn-js como base de renderização, edição e serialização. Customizações entram
como módulos adicionais (`additionalModules`) e extensões moddle, sem fork.

## Consequências

- **Positivas**: escopo BPMN completo desde o dia 1.
- **Negativas**: a licença exige a marca d'água ([ADR-0004](0004-licenca-mit-e-marca-dagua-bpmn-io.md));
  overrides de CSS dependem de seletores internos que não são API pública.
- **Mitigação**: overrides isolados em `src/components/editor/bpmn-theme.css`,
  revisados a cada atualização do bpmn-js.
