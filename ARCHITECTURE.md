# archQuest — Decisões de Arquitetura

Ferramenta de modelagem de processos de negócio (BPM) open-source, inspirada na notação
robusta do Bizagi e na facilidade de uso do Whimsical. Este documento registra as
decisões tomadas na sessão de arquitetura inicial e serve como referência para
contribuidores.

## Negócio

- **Licença**: MIT. O bpmn-js é publicado sob a "bpmn.io license" (derivada de MIT), que
  exige manter visível a marca d'água "powered by bpmn.io" nos diagramas renderizados,
  a menos que se adquira uma licença comercial da Camunda para removê-la. Essa obrigação
  se propaga para o archQuest.
- **Modelo**: projeto open-source, sem plano de monetização no momento.
- **Nome do projeto**: archQuest (mantido; pode ser revisitado depois — renomear é barato).

## Escopo funcional (MVP)

- **Notação**: BPMN 2.0 real, não uma notação simplificada própria. Garante
  interoperabilidade (import/export de XML) com Bizagi, Camunda e outras ferramentas.
- **Elementos suportados no v1** (núcleo + intermediário):
  - Tarefas
  - Eventos de início/fim
  - Gateways: exclusivo, paralelo, inclusivo
  - Sub-processos
  - Raias / pools e lanes
  - Fora do v1 (adiado para v2): eventos de mensagem/timer, data objects.
- **UX**:
  - Canvas infinito com pan/zoom e toolbar minimalista (em vez da ribbon densa do Bizagi).
  - Paleta flutuante de "quick-add": clicar/arrastar elementos direto no canvas.
  - Tela inicial "biblioteca de diagramas": lista dos projetos salvos localmente, com
    thumbnail.
- **Exportação**: arquivo `.bpmn` (XML) e imagem PNG/SVG, ambos já no v1.
- **Colaboração**: single-player (edição individual) para começar; multiplayer em tempo
  real fica para uma fase futura.
- **Tema**: claro/escuro, com toggle manual (persistido em `localStorage`) e detecção da
  preferência do sistema no primeiro acesso.
- **Estilização de elementos**: usuário pode customizar, por elemento selecionado, a cor
  de preenchimento e borda (via `modeling.setColor()`, nativo do bpmn-js — usa os
  namespaces `bioc:`/`color:` já entendidos por outras ferramentas BPMN) e a cor/negrito/
  itálico/sublinhado do texto. Como BPMN não tem conceito de texto rico, essas quatro
  propriedades de texto são persistidas numa extensão XML própria
  (`archquest:textStyle`, ver `src/components/editor/text-style-moddle.json`) e
  renderizadas por um `TextStyleRenderer` customizado que decora o texto já desenhado
  pelo bpmn-js. Isso mantém o restante do XML 100% interoperável — outras ferramentas
  simplesmente ignoram a extensão desconhecida — mas o negrito/itálico/sublinhado em si
  só é visível dentro do archQuest.
- **Fora do v1**: galeria de templates prontos.

## Arquitetura técnica

- **Motor de diagrama**: [bpmn-js](https://github.com/bpmn-io/bpmn-js) (Camunda/bpmn.io) —
  reutilizado como base de renderização, edição e serialização BPMN 2.0, em vez de
  construir um motor gráfico do zero.
- **Frontend**: React + TypeScript.
- **Estilo**: Tailwind CSS + shadcn/ui.
- **Estrutura de repositório**: projeto único (sem monorepo). Pode ser dividido em
  pacotes no futuro caso surja necessidade real (ex.: extrair um backend).
- **Plataforma**: web-first. Sem app desktop/offline nativo no v1.
- **Deploy**: Netlify, com preview automático por Pull Request.

## Armazenamento

- **Modelo**: local-first, sem backend no v1.
- **Persistência**: IndexedDB no navegador.
- **Modelo de dados**: híbrido.
  - XML BPMN 2.0 puro como formato de exportação e fonte de verdade para
    interoperabilidade (o arquivo `.bpmn` exportado abre em qualquer ferramenta
    compatível).
  - Envelope JSON com metadados da aplicação (título, thumbnail, timestamps) guardado
    junto no IndexedDB, para alimentar a biblioteca local de diagramas.
- **Salvamento**: IndexedDB + botões manuais de exportar/importar arquivo. A File System
  Access API (salvar/abrir direto do disco, só em Chrome/Edge) fica de fora do v1 para
  garantir compatibilidade universal entre navegadores; pode ser adicionada depois como
  progressive enhancement.

## Decisões técnicas de baixo nível (não discutidas em detalhe, escolhidas por
convenção/maturidade do ecossistema)

- Bundler: Vite.
- Gerenciador de pacotes: npm (zero setup adicional para novos contribuidores).
- Persistência IndexedDB: Dexie.js.
- Gerenciamento de estado de UI: a definir durante a implementação (Zustand é o
  candidato natural para um app de canvas).
- CI: GitHub Actions (lint + testes em cada PR); deploy fica a cargo do Netlify.
