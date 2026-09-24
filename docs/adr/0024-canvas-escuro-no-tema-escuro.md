# ADR-0024: Manter o canvas do editor escuro no tema escuro

- **Status**: Accepted (substitui a parte do [ADR-0011](0011-tema-claro-e-escuro.md) sobre o preenchimento das formas)
- **Data**: 2026-09-24

## Contexto

O ADR-0011 manteve as formas BPMN brancas nos dois temas, por convenção de notação e para
os arquivos exportados saírem iguais. No tema escuro isso deixava blocos brancos
ofuscando o canvas escuro, e a decisão de produto passou a ser: o tema escuro fica escuro
em tudo, inclusive no editor.

## Opções consideradas

1. **Recriar o modeler com cores novas a cada troca de tema**: funciona, mas perde a pilha
   de desfazer e reimporta o diagrama.
2. **Sobrescrever as cores por CSS com `!important`**: também apagaria as cores escolhidas
   pelo usuário.
3. **Cores padrão do renderer como variáveis CSS**: o `bpmnRenderer` recebe
   `var(--bpmn-shape-fill)` e `var(--bpmn-shape-stroke)`, e o tema troca na hora, sem
   recriar nada.

## Decisão

Opção 3. As variáveis ficam em `src/index.css` (`--bpmn-shape-fill: var(--card)`,
`--bpmn-shape-stroke: var(--foreground)`) e as cores do renderer em
`src/lib/diagram-colors.ts`, usadas pelo editor, pelo visualizador público e pela prévia
de modelos. Cores escolhidas pelo usuário continuam valendo nos dois temas.

Todo SVG que sai do app (exportação SVG/PNG e miniaturas da galeria) passa por
`resolveThemedColorsForExport`, que troca as variáveis pela paleta clara de papel
(`#ffffff` e `#0a0a0a`). Na galeria, o tema escuro mostra essas miniaturas invertidas.

## Consequências

- **Positivas**: tema escuro consistente em todas as telas; troca instantânea; exportações
  idênticas às de antes.
- **Negativas**: qualquer novo caminho que gere SVG precisa passar por
  `resolveThemedColorsForExport`, senão o arquivo sai com variáveis CSS sem valor.
