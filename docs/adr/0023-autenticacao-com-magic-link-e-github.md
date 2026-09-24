# ADR-0023: Autenticar com magic link + GitHub em vez de Google

- **Status**: Accepted
- **Data**: 2026-09-24

## Contexto

O [ADR-0016](0016-modo-convidado-e-autenticacao.md) escolheu magic link + Google OAuth.
Antes de implementar o login (Tarefa 9), o provider social foi revisto. O público do
archQuest é técnico e quase sempre tem conta no GitHub, onde o projeto já vive (código,
CI e issues). O OAuth do Google exige tela de consentimento, domínios autorizados,
usuários de teste e publicação do app no Google Cloud; o OAuth App do GitHub é criado
em uma única tela.

## Opções consideradas

1. **Manter Google** — conta mais comum entre não desenvolvedores / configuração mais
   longa no Google Cloud, com modo "Teste" limitado a usuários cadastrados.
2. **Trocar por GitHub** — alinhado ao público e ao repositório; configuração simples /
   quem não tem GitHub depende do magic link.
3. **Google e GitHub** — mais opções / duas configurações externas para manter.

## Decisão

- **Login**: magic link por e-mail + GitHub OAuth (Supabase Auth). O Google OAuth não
  entra. Quem só visualiza links públicos nunca precisa logar.
- O restante do ADR-0016 continua valendo sem mudança:
  - **Modo convidado**: sem login, os diagramas ficam só no IndexedDB. Sem
    `VITE_SUPABASE_*`, o app roda sempre em modo convidado; testes e CI não precisam de
    backend.
  - **Primeiro login**: se houver diagramas de convidado, um diálogo pergunta quais
    enviar para a conta.
  - **Logout**: o cache local dos diagramas da nuvem é apagado; se houver alterações não
    sincronizadas, o app avisa antes. Os diagramas de convidado permanecem.

## Consequências

- **Positivas**: configuração externa menor (um OAuth App no GitHub); login com a conta
  que o público já usa no projeto.
- **Negativas**: quem não tem GitHub precisa do magic link, que depende de SMTP.
- **Riscos e mitigações**: o GitHub pode não devolver e-mail quando ele é privado; o
  Supabase pede o escopo `user:email` para buscá-lo, então não há configuração extra.
  Adicionar o Google depois continua possível sem mudar o modelo de dados.

## Relacionados

- [ADR-0014](0014-supabase-como-backend.md)
- [ADR-0016](0016-modo-convidado-e-autenticacao.md) (substituído)
