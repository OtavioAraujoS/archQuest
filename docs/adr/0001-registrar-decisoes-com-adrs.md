# ADR-0001: Registrar decisões de arquitetura com ADRs

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

As decisões iniciais do archQuest viviam num único `ARCHITECTURE.md`. Com a parte 2
(nuvem, autenticação, novos recursos de modelagem), várias dessas decisões mudam. Um
documento único não mostra o que foi substituído, quando, nem por quê.

## Opções consideradas

1. **Manter o `ARCHITECTURE.md` único** — simples, mas sobrescreve o histórico.
2. **ADRs no formato Nygard** — curtos, mas não registram alternativas descartadas.
3. **ADRs em MADR enxuto** — registram opções consideradas, o que evita reabrir
   discussões já encerradas por contribuidores externos.

## Decisão

Usar ADRs em MADR enxuto, em português, em `docs/adr/NNNN-titulo.md`, a partir de
[`template.md`](template.md). O `ARCHITECTURE.md` foi removido; suas decisões viraram os
ADRs 0002–0013, e o índice fica em [`README.md`](README.md).

## Consequências

- **Positivas**: histórico explícito de decisões substituídas; cada decisão é revisável
  isoladamente em PR.
- **Negativas**: não há mais uma página única de visão geral — o índice cumpre esse papel.
- **Regra**: ADR aceito não é editado no mérito; uma mudança de rumo gera um novo ADR que
  o substitui (`Superseded`).
