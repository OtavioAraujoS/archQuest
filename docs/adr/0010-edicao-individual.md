# ADR-0010: Manter edição individual, sem colaboração em tempo real

- **Status**: Accepted (complementado pelo [ADR-0018](0018-links-publicos-de-leitura.md))
- **Data**: 2026-09-23

## Contexto

Colaboração multiplayer em tempo real exige backend, presença, resolução de conflitos em
nível de operação (CRDT/OT) e muda profundamente a arquitetura.

## Decisão

Cada diagrama tem um único editor (seu dono). Multiplayer em tempo real fica para uma
fase futura. Na parte 2, outras pessoas passam a poder **visualizar** diagramas por link
público ([ADR-0018](0018-links-publicos-de-leitura.md)), mas não editar.

## Consequências

- **Positivas**: conflitos se limitam ao mesmo usuário em vários dispositivos/abas,
  tratados por versão ([ADR-0017](0017-conflitos-por-versao.md)).
- **Negativas**: times não coeditam; compartilhar é só leitura.
