# ADR-0005: Usar React + TypeScript + Vite com Tailwind e shadcn/ui

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

Precisávamos de uma stack de frontend madura, familiar a contribuidores e que convivesse
bem com o bpmn-js (que manipula o DOM diretamente).

## Decisão

- React + TypeScript, empacotados com Vite.
- Tailwind CSS + shadcn/ui para a interface.
- npm como gerenciador de pacotes (zero setup adicional).
- Vitest + Testing Library para testes.

## Consequências

- **Positivas**: ecossistema amplo; tokens de tema do Tailwind reaproveitados pelo tema do
  bpmn-js ([ADR-0011](0011-tema-claro-e-escuro.md)).
- **Negativas**: o bpmn-js vive fora do ciclo de render do React; a integração fica
  isolada em hooks (`useBpmnEditor`).
