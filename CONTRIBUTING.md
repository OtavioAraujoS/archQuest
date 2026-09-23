# Contribuindo com o archQuest

Obrigado pelo interesse em contribuir! Este guia cobre o básico para rodar o projeto
localmente e abrir um PR.

## Contexto do projeto

Antes de mexer em arquitetura, dê uma lida nos [ADRs](./docs/adr/README.md) — lá
estão as decisões já tomadas (motor BPMN, armazenamento, stack, escopo) e o raciocínio
por trás delas, incluindo as alternativas descartadas. Ajuda a evitar propor de novo algo
que já foi decidido conscientemente. Para propor uma mudança de arquitetura, abra um PR
com um novo ADR a partir do [template](./docs/adr/template.md).

## Rodando o projeto localmente

Setup completo e scripts disponíveis estão no [README](./README.md#rodando-localmente).
Resumindo:

```bash
npm install
npm run dev
```

## Antes de abrir um PR

Rode localmente os mesmos checks que o CI ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml))
vai rodar:

```bash
npm run lint
npm run build
npm test
```

Um PR só é revisado depois que esses três passam. Se algum falhar por um motivo que você
acha que não tem a ver com sua mudança, mencione isso na descrição do PR.

## Aviso sobre a licença do bpmn-js

O archQuest depende do [bpmn-js](https://bpmn.io/license/), cuja licença exige manter
visível a marca d'água "powered by bpmn.io" em qualquer diagrama renderizado. **Não
remova, oculte ou sobreponha essa marca d'água** em nenhuma mudança de UI ou de estilo
(veja `src/components/editor/bpmn-theme.css` para o que já é seguro customizar).

## Convenções de código

- Evite comentários no código — prefira nomes de função/variável que já expliquem o que
  está acontecendo. Comente só quando o *porquê* não for óbvio (uma decisão não-trivial,
  uma limitação de uma lib externa, etc.).
- Mantenha arquivos pequenos e coesos: se um arquivo está misturando responsabilidades
  diferentes (ex.: lógica de integração com uma lib externa + renderização de UI), separe
  em módulos — veja `src/components/editor/useBpmnEditor.ts` (lógica) vs.
  `BpmnEditor.tsx` (apresentação) como exemplo do padrão.
- Testes ficam em `__tests__/`, na raiz, espelhando as pastas de `src/`: o teste de
  `src/lib/db.ts` é `__tests__/lib/db.test.ts`. Importe o código testado pelo alias
  `@/` (inclusive em `vi.mock`). Helpers só de teste também ficam em `__tests__/`.
