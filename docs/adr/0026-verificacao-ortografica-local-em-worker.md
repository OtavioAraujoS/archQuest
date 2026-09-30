# ADR-0026: Verificar a ortografia em português localmente, em um Web Worker

- **Status**: Accepted
- **Data**: 2026-09-30

## Contexto

A interface e os diagramas são escritos em pt-BR, mas nada validava a ortografia: o
`index.html` declarava `lang="en"` e o editor de rótulos do bpmn-js não marca erros.
Queremos avisar sobre erros enquanto a pessoa escreve rótulos, o nome do diagrama e o nome
de uma pasta, com sugestões de correção. O app roda sem conta e offline
([ADR-0015](0015-nuvem-como-fonte-da-verdade.md)), então a verificação não pode depender
de um serviço externo, e nada pode entrar no SVG exportado
([ADR-0024](0024-canvas-escuro-no-tema-escuro.md)).

## Opções consideradas

1. **Corretor nativo do navegador** (`lang` + `spellcheck`) — custo zero; contras: depende
   de o navegador ter o dicionário pt-BR, sem controle sobre sugestões nem sobre os
   rótulos já gravados.
2. **`espells` + `dictionary-pt` em um Web Worker** — JavaScript puro, offline, lê o
   dicionário Hunspell VERO; contras: ~3 s para carregar e ~400 MB de memória no worker.
3. **Hunspell em WebAssembly** (`hunspell-asm`) — memória e carga menores; contras:
   biblioteca sem manutenção desde 2019 e configuração de WASM no Vite e nos testes.
4. **Serviço externo** (LanguageTool) — também cobre gramática; contras: exige rede e
   envia o texto dos diagramas para terceiros.

## Decisão

- Opção 2. O motor fica em `src/lib/spelling/` e só roda dentro de um Web Worker, criado
  na primeira consulta e encerrado após dois minutos ocioso; as respostas ficam em cache
  por palavra na página.
- O dicionário entra no build como módulo `?raw` importado dinamicamente pelo worker: vira
  chunk com hash em `/assets/`, já coberto pelo cache imutável e pelo gzip, sem mudar
  `docker/nginx.conf` nem `netlify.toml`. O alias `dictionary-pt-files` no `vite.config.ts`
  contorna o `exports` do pacote, que só expõe a leitura via `node:fs`.
- Siglas em maiúsculas, palavras com dígitos, e-mails, links, nomes com maiúscula interna e
  uma lista curta de termos de negócio (`accepted-terms.ts`) não são verificados.
- No canvas, um módulo adicional do bpmn-js ([ADR-0003](0003-bpmn-js-como-motor.md))
  sublinha as palavras na edição direta com a CSS Custom Highlight API, sem alterar o DOM
  do editor, e marca os rótulos já gravados com overlays HTML, que ficam fora do SVG.
- Nos campos de nome, uma dica abaixo do campo lista as palavras suspeitas e as sugestões.
- `index.html` passa a declarar `lang="pt-BR"`; o corretor nativo continua valendo onde o
  motor não responder.

## Consequências

- **Positivas**: verificação offline e igual em todos os navegadores, com sugestões; o
  bundle inicial não cresce, porque worker e dicionário são baixados sob demanda.
- **Negativas**: ~5,5 MB de dicionário (antes da compressão) e ~400 MB de memória enquanto
  o worker está vivo; o sublinhado ao digitar depende da Highlight API; nomes próprios e
  estrangeirismos fora da lista geram falsos positivos, e ainda não há dicionário pessoal.
- **Riscos e mitigações**: se o worker ou o dicionário falharem, a verificação se desliga
  em silêncio e o app segue funcionando. A edição direta é alcançada pelo campo privado
  `directEditing._textbox`; o acesso é defensivo e coberto por teste, e deve ser revisto a
  cada atualização do bpmn-js. Se a memória pesar em máquinas modestas, a saída é trocar o
  motor pela opção 3 atrás da mesma interface (`spelling-client.ts`).
- **Licenças**: `espells` é MPL-2.0 e o dicionário VERO (`dictionary-pt`) é
  LGPL-3.0 ou MPL-2.0; ambos são usados sem modificação.

## Relacionados

- ADR-0003
- ADR-0015
- ADR-0024
