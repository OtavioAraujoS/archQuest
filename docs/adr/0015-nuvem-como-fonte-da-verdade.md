# ADR-0015: Tornar a nuvem a fonte da verdade, com cache offline no IndexedDB

- **Status**: Accepted (substitui o [ADR-0007](0007-armazenamento-local-first-sem-backend.md))
- **Data**: 2026-09-23

## Contexto

Com diagramas compartilháveis, a versão local e a versão na nuvem precisam ter uma
relação clara.

## Opções consideradas

1. **Local-first + botão "Publicar"** — menor mudança, mas duas versões divergentes do
   mesmo diagrama.
2. **Nuvem como fonte da verdade, IndexedDB como cache** — um único estado canônico,
   acessível de qualquer dispositivo; exige fila offline e tratamento de conflitos.
3. **Híbrido por diagrama** — dois comportamentos de salvamento para o usuário entender.

## Decisão

Para usuários logados, a nuvem é a fonte da verdade:
- O editor continua gravando no IndexedDB com o autosave atual; uma fila envia as
  alterações ao Supabase quando há conexão.
- Offline, a edição continua normalmente e as alterações ficam pendentes até a conexão
  voltar.
- O cabeçalho mostra o status: "Salvo na nuvem", "Salvando…" ou "Offline — alterações
  pendentes".
- O estado de sincronização vive num store Zustand.
- Excluir um diagrama é definitivo (com confirmação) e também invalida o link público.

## Consequências

- **Positivas**: o mesmo diagrama em qualquer dispositivo; o editor não trava sem rede.
- **Negativas**: exige tratar conflitos ([ADR-0017](0017-conflitos-por-versao.md)) e o
  ciclo de vida do cache no logout ([ADR-0016](0016-modo-convidado-e-autenticacao.md)).
