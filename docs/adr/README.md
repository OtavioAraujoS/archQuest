# Architecture Decision Records

Decisões de arquitetura do archQuest. Formato e regras em
[ADR-0001](0001-registrar-decisoes-com-adrs.md).

## Índice

| ADR | Título | Status |
| --- | --- | --- |
| [0001](0001-registrar-decisoes-com-adrs.md) | Registrar decisões de arquitetura com ADRs | Accepted |
| [0002](0002-notacao-bpmn-2-e-escopo-de-elementos.md) | Usar BPMN 2.0 real como notação | Accepted |
| [0003](0003-bpmn-js-como-motor.md) | Usar bpmn-js como motor de diagrama | Accepted |
| [0004](0004-licenca-mit-e-marca-dagua-bpmn-io.md) | Licenciar sob MIT e manter a marca d'água do bpmn.io | Accepted |
| [0005](0005-stack-de-frontend.md) | Usar React + TypeScript + Vite com Tailwind e shadcn/ui | Accepted |
| [0006](0006-projeto-unico-web-first.md) | Manter um repositório único e web-first | Accepted |
| [0007](0007-armazenamento-local-first-sem-backend.md) | Armazenar diagramas localmente no IndexedDB, sem backend | Superseded por 0015 |
| [0008](0008-modelo-de-dados-hibrido.md) | Usar modelo de dados híbrido (XML BPMN + envelope JSON) | Accepted |
| [0009](0009-import-export-manual-de-arquivos.md) | Salvar em disco só via import/export manual | Superseded por 0019 |
| [0010](0010-edicao-individual.md) | Manter edição individual, sem colaboração em tempo real | Accepted |
| [0011](0011-tema-claro-e-escuro.md) | Oferecer tema claro/escuro derivado dos tokens do Tailwind | Accepted |
| [0012](0012-estilizacao-de-elementos.md) | Estilizar elementos com `setColor` e `archquest:textStyle` | Accepted |
| [0013](0013-ci-github-actions-e-deploy-netlify.md) | Rodar CI no GitHub Actions e fazer deploy no Netlify | Accepted |
| [0014](0014-supabase-como-backend.md) | Usar Supabase como backend | Accepted |
| [0015](0015-nuvem-como-fonte-da-verdade.md) | Tornar a nuvem a fonte da verdade, com cache offline | Accepted |
| [0016](0016-modo-convidado-e-autenticacao.md) | Manter modo convidado e autenticar com magic link + Google | Accepted |
| [0017](0017-conflitos-por-versao.md) | Detectar conflitos por número de versão | Accepted |
| [0018](0018-links-publicos-de-leitura.md) | Compartilhar diagramas por link público só de leitura | Accepted |
| [0019](0019-file-system-access-como-espelho.md) | Usar a File System Access API como espelho opcional em disco | Accepted |
| [0020](0020-paleta-agrupada-e-painel-de-propriedades.md) | Agrupar eventos na paleta e criar um painel de propriedades próprio | Accepted |
| [0021](0021-templates-estaticos.md) | Distribuir templates como arquivos `.bpmn` estáticos | Accepted |

## Criando um ADR

1. Copie [`template.md`](template.md) para `NNNN-titulo-com-hifens.md` (próximo número livre).
2. Preencha e abra um PR.
3. Adicione a linha no índice acima.
4. Para mudar uma decisão aceita, crie um ADR novo e marque o antigo como
   `Superseded por NNNN`; não reescreva o mérito do antigo.
