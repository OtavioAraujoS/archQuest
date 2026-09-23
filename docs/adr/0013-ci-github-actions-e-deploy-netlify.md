# ADR-0013: Rodar CI no GitHub Actions e fazer deploy no Netlify

- **Status**: Accepted
- **Data**: 2026-09-23

## Decisão

- GitHub Actions roda `npm ci`, `npm run lint`, `npm run build` e `npm test` em cada PR e
  push para `main` (`.github/workflows/ci.yml`).
- Netlify faz o deploy de produção e os previews por PR (`netlify.toml`), com redirect
  `/* -> /index.html` para as rotas client-side.

## Consequências

- **Positivas**: contribuições externas são validadas antes da revisão; cada PR tem
  preview.
- **Negativas**: a partir da parte 2, o deploy depende de `VITE_SUPABASE_URL` e
  `VITE_SUPABASE_ANON_KEY` configuradas no Netlify. O CI roda sem elas, em modo
  convidado ([ADR-0016](0016-modo-convidado-e-autenticacao.md)).
