# ADR-0002: Usar BPMN 2.0 real como notação

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

O archQuest quer a robustez de notação do Bizagi com a facilidade de uso do Whimsical.
Uma notação própria simplificada seria mais fácil de desenhar, mas isolaria os diagramas
do ecossistema de BPM.

## Opções consideradas

1. **Notação própria simplificada** — liberdade de UX, zero interoperabilidade.
2. **BPMN 2.0 real** — import/export de XML com Bizagi, Camunda e outras ferramentas.

## Decisão

Adotar BPMN 2.0 real. Escopo de elementos do v1 (núcleo + intermediário): tarefas,
eventos de início/fim, gateways exclusivo/paralelo/inclusivo, sub-processos, pools e
raias. Eventos de mensagem/timer e data objects ficaram para a parte 2
(ver [ADR-0020](0020-paleta-agrupada-e-painel-de-propriedades.md)).

Escopo de UX e exportação do MVP:
- Canvas infinito com pan/zoom e toolbar minimalista, em vez da ribbon densa do Bizagi.
- Paleta flutuante de "quick-add" para clicar/arrastar elementos direto no canvas.
- Tela inicial "biblioteca de diagramas" com os projetos salvos e thumbnail.
- Exportação em `.bpmn` (XML), PNG e SVG.
- Galeria de templates ficou fora do v1 (ver [ADR-0021](0021-templates-estaticos.md)).

## Consequências

- **Positivas**: o `.bpmn` exportado abre em qualquer ferramenta compatível.
- **Negativas**: a UX fica limitada ao que o modelo BPMN permite representar.

## Relacionados

- [ADR-0003](0003-bpmn-js-como-motor.md)
