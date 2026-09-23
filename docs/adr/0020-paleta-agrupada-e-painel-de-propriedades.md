# ADR-0020: Agrupar eventos na paleta e criar um painel de propriedades próprio

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

Eventos de mensagem/timer e data objects/stores já podem ser criados pelo Modeler padrão,
mas só criando um evento genérico e trocando o tipo pelo menu da chave inglesa. E não há
UI para configurar suas propriedades: um timer sem duração é só um desenho.

## Opções consideradas

Para o painel:
1. **`bpmn-js-properties-panel` oficial** — cobre timer e mensagem, mas é pesado e tem
   visual próprio.
2. **Painel próprio** — só os campos necessários, no estilo do `ElementStylePanel`.

## Decisão

- **Paleta**: um botão "Eventos ▸" que abre as variantes de mensagem/timer (início,
  intermediário de captura/envio, fim), além de data object e data store. Se o bpmn-js
  não permitir o agrupamento sem hacks, entram soltos os 4 mais usados: início de timer,
  início de mensagem, intermediário de timer e data object.
- **Painel próprio**, sem o `bpmn-js-properties-panel`.
- **Timer**: UI amigável (tipo data/duração/ciclo + campos legíveis, ex. "a cada 10 min,
  3 vezes") que grava ISO 8601 em `timeDate`/`timeDuration`/`timeCycle`.
- **Mensagem**: um campo para escolher uma `bpmn:Message` existente ou criar uma nova,
  referenciada por `messageRef`.

## Consequências

- **Positivas**: o XML gerado é interoperável com Camunda/Bizagi; UI coerente com o resto
  do app.
- **Negativas**: cada nova propriedade suportada é código nosso para manter.
