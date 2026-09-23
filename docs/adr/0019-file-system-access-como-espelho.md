# ADR-0019: Usar a File System Access API como espelho opcional em disco

- **Status**: Accepted (substitui o [ADR-0009](0009-import-export-manual-de-arquivos.md))
- **Data**: 2026-09-23

## Contexto

Usuários querem abrir e salvar `.bpmn` direto no disco, com Ctrl+S gravando no mesmo
arquivo. A API só existe em Chromium, e a nuvem já é a fonte da verdade.

## Opções consideradas

1. **Arquivo como espelho** — Ctrl+S grava no arquivo vinculado; a nuvem continua canônica.
2. **"Salvar no arquivo" como export melhorado**, sem vínculo.
3. **Pasta local como biblioteca/workspace** — cria uma terceira fonte da verdade.

## Decisão

- "Abrir arquivo" importa o `.bpmn` para a biblioteca e mantém o vínculo com o arquivo.
- "Salvar no arquivo" escolhe o local e cria o vínculo.
- Com vínculo, Ctrl+S grava no arquivo; o autosave na nuvem/IndexedDB continua em
  paralelo.
- Sem suporte à API (Firefox/Safari), os botões de importar/exportar do v1 continuam.

## Consequências

- **Positivas**: fluxo de "arquivo no disco" para quem precisa, sem mudar a fonte da
  verdade.
- **Negativas**: o vínculo com o arquivo vale só na sessão/navegador atual; comportamento
  diferente entre navegadores.
