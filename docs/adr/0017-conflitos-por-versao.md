# ADR-0017: Detectar conflitos por número de versão

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

O mesmo diagrama pode ser editado em duas abas, em dois dispositivos, ou offline num
lugar e online em outro ([ADR-0015](0015-nuvem-como-fonte-da-verdade.md)).

## Opções consideradas

1. **Última gravação vence** — simples, perde trabalho sem aviso.
2. **Checagem de versão (concorrência otimista)** — o usuário decide o que fazer.
3. **Merge automático do XML** — complexo e arriscado para BPMN.

## Decisão

Cada diagrama tem uma coluna `version`. Uma gravação só é aceita se a versão enviada for
igual à do servidor; caso contrário o app avisa e oferece "Manter a minha" (sobrescreve)
ou "Carregar a do servidor" (descarta a alteração local).

## Consequências

- **Positivas**: nenhum trabalho perdido em silêncio.
- **Negativas**: a escolha é por diagrama inteiro, não por elemento.
