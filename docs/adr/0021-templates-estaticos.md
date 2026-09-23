# ADR-0021: Distribuir templates como arquivos `.bpmn` estáticos no repositório

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

Começar de um diagrama em branco é a maior barreira para quem não conhece BPMN.

## Opções consideradas

1. **Arquivos estáticos no repositório** — versionados, revisáveis em PR, funcionam
   offline e no modo convidado.
2. **Templates publicados na nuvem pela comunidade** — exige moderação e backend.

## Decisão

Templates em `src/templates/`, em português, abertos por "Novo diagrama → a partir de
template" na biblioteca:
1. Aprovação de compra (gateway exclusivo por valor)
2. Onboarding de funcionário (raias RH/TI/Gestor)
3. Atendimento ao cliente (eventos de mensagem)
4. Reembolso de despesas (timer de prazo)
5. Processo em branco com pool e 2 raias

## Consequências

- **Positivas**: contribuidores adicionam templates com um PR.
- **Negativas**: novos templates exigem um deploy; galeria da comunidade fica para depois.
