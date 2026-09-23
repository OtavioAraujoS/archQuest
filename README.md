# archQuest

Modelagem de processos de negócio (BPMN 2.0) com a facilidade de uso de um
whiteboard. Pense: a robustez do Bizagi, com a simplicidade do Whimsical.

Projeto open-source, licenciado sob MIT.

## Stack

- [bpmn-js](https://github.com/bpmn-io/bpmn-js) — motor de renderização/edição BPMN 2.0
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Dexie (IndexedDB) para armazenamento local-first — sem backend

As decisões de arquitetura completas estão documentadas em [ARCHITECTURE.md](./ARCHITECTURE.md).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:5173. Nenhuma conta ou servidor é necessário — tudo roda no
navegador e os diagramas ficam salvos localmente via IndexedDB.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção (`dist/`)
- `npm run preview` — serve o build de produção localmente
- `npm run lint` — roda o oxlint

## Aviso de licença

Este projeto depende do [bpmn-js](https://bpmn.io/license/), cuja licença exige manter
visível a marca d'água "powered by bpmn.io" nos diagramas renderizados. Não a remova.
