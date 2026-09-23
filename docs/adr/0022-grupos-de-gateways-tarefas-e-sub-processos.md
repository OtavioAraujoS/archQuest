# ADR-0022: Transformar os botões de gateway, tarefa e sub-processo em grupos

- **Status**: Accepted (complementa o [ADR-0020](0020-paleta-agrupada-e-painel-de-propriedades.md))
- **Data**: 2026-09-23

## Contexto

O grupo "Eventos" do ADR-0020 resolveu o acesso a eventos de mensagem e timer. Os outros
tipos BPMN tinham o mesmo problema: gateways paralelo/inclusivo, tarefas de usuário/serviço
e sub-processos de evento só eram criáveis trocando o tipo pela chave inglesa.

## Opções consideradas

1. **Botão novo ao lado de cada botão padrão** — não muda o que já existe, mas a paleta
   dobra de tamanho.
2. **O botão padrão vira o grupo** — clicar abre o menu de variantes; arrastar continua
   criando o tipo padrão. A paleta não cresce.

## Decisão

Opção 2, para gateway, tarefa e sub-processo:
- **Gateways**: exclusivo (padrão), paralelo, inclusivo, baseado em eventos, complexo.
- **Tarefas**: tarefa (padrão), usuário, serviço, manual, script, envio, recebimento,
  regra de negócio.
- **Sub-processos**: expandido com evento de início (padrão), colapsado, de evento,
  transação (com evento de início), call activity.

O grupo "Eventos" continua como botão próprio. Todos os grupos são dados em
`src/components/editor/palette/groups/`, lidos por um único `GroupedPaletteProvider`,
que usa só APIs públicas do diagram-js (`palette.registerProvider` com updater e
`popupMenu.registerProvider`).

## Consequências

- **Positivas**: todo tipo BPMN comum fica a dois cliques; um grupo novo é só um arquivo
  de dados.
- **Negativas**: quem já conhece o bpmn-js espera que clicar no botão crie o elemento na
  hora; aqui clicar abre o menu, e só arrastar cria direto.
