# ADR-0018: Compartilhar diagramas por link público só de leitura

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

O objetivo da parte 2 é que outras pessoas consigam visualizar um processo.

## Opções consideradas

1. **Link público de leitura** — sem login para quem vê.
2. **Convite por e-mail com login** — mais controle, mais atrito.
3. **Galeria pública** — exige moderação.

Para o conteúdo: ao vivo (estado atual) ou snapshot publicado explicitamente.

## Decisão

- Publicar gera um slug aleatório, separado do id interno: `/view/<slug>`.
- Despublicar invalida o slug; publicar de novo gera um link novo.
- O visitante vê o estado atual do diagrama (ao vivo), sem snapshot separado.
- A página usa o Viewer do bpmn-js (pan/zoom, só leitura) e mostra o nome do diagrama, a
  data da última atualização e botões para baixar `.bpmn`, PNG e SVG. Não mostra o autor,
  para não expor o e-mail. A marca d'água do bpmn.io continua visível
  ([ADR-0004](0004-licenca-mit-e-marca-dagua-bpmn-io.md)).
- Diagrama excluído ou despublicado mostra "Diagrama não encontrado".
- "Duplicar para minha conta" fica fora da parte 2.

## Consequências

- **Positivas**: compartilhar é copiar um link; revogar é um clique.
- **Negativas**: rascunhos em diagramas publicados ficam visíveis imediatamente.
