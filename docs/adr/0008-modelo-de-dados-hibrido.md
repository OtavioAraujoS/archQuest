# ADR-0008: Usar modelo de dados híbrido (XML BPMN + envelope JSON)

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

A biblioteca de diagramas precisa de metadados (título, thumbnail, timestamps) que não
pertencem ao XML BPMN, mas o XML precisa continuar puro para interoperabilidade.

## Decisão

Cada diagrama é um registro com o XML BPMN 2.0 puro (fonte da verdade para
interoperabilidade e formato de exportação) e um envelope JSON com metadados da
aplicação. Vale para o IndexedDB e para a tabela na nuvem
([ADR-0015](0015-nuvem-como-fonte-da-verdade.md)), que acrescenta `version`, dono e slug
público.

## Consequências

- **Positivas**: o `.bpmn` exportado abre em qualquer ferramenta; a biblioteca tem
  thumbnail e ordenação sem parsear XML.
- **Negativas**: metadados e XML precisam ser gravados juntos para não divergirem.
