# ADR-0016: Manter modo convidado e autenticar com magic link + Google

- **Status**: Accepted
- **Data**: 2026-09-23

## Contexto

O archQuest sempre abriu sem conta. Exigir login mudaria essa proposta e obrigaria
contribuidores a configurar um backend só para rodar o app.

## Opções consideradas

1. **Login obrigatório** — modelo único, mas sem uso anônimo.
2. **Modo convidado** — sem login, o app funciona só local; logado, usa a nuvem.
3. **Sem login, só visualizar links** — impede usar o editor anonimamente.

Para o login: magic link, Google e GitHub OAuth.

## Decisão

- **Modo convidado**: sem login, os diagramas ficam só no IndexedDB, como no v1. Sem
  `VITE_SUPABASE_*` configuradas, o app roda sempre em modo convidado; testes e CI não
  precisam de backend.
- **Login**: magic link por e-mail + Google OAuth (Supabase Auth). Quem só visualiza links
  públicos nunca precisa logar.
- **Primeiro login**: se houver diagramas de convidado, um diálogo pergunta quais enviar
  para a conta.
- **Logout**: o cache local dos diagramas da nuvem é apagado; se houver alterações ainda
  não sincronizadas, o app avisa antes. Os diagramas de convidado permanecem.

## Consequências

- **Positivas**: mantém o "abre e já usa"; seguro em computadores compartilhados.
- **Negativas**: dois modos de persistência para testar; a configuração do OAuth no
  Google Cloud fica fora do repositório.
