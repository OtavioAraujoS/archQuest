# ADR-0004: Licenciar sob MIT e manter a marca d'água do bpmn.io

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

O projeto é open-source, sem plano de monetização. O bpmn-js é publicado sob a "bpmn.io
license" (derivada de MIT), que exige manter visível a marca d'água "powered by bpmn.io"
nos diagramas renderizados, salvo licença comercial da Camunda.

## Decisão

Licenciar o archQuest sob MIT. Manter a marca d'água visível em toda superfície que
renderiza diagramas — editor e página pública de visualização
([ADR-0018](0018-links-publicos-de-leitura.md)).

## Consequências

- **Positivas**: licença permissiva, atrativa para contribuidores.
- **Negativas**: a obrigação da marca d'água se propaga para forks e para qualquer
  mudança de UI; está destacada no `CONTRIBUTING.md`.
- O nome "archQuest" foi mantido; renomear é barato e pode ser revisitado.
