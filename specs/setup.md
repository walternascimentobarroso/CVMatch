# Setup

## Objetivo

Ter o projeto CVMatch a arrancar localmente com a stack decidida em `docs/prd.md`, para que as specs `cv-upload`, `analise` e `resultado` possam ser construídas em cima dele.

## Requisitos

- **R1** — Projeto Next.js (App Router) com TypeScript, na raiz do repositório, gerido com pnpm.
- **R2** — Tailwind CSS e shadcn/ui configurados.
- **R3** — ESLint com a configuração que vem do `create-next-app`.
- **R4** — A página inicial mostra um placeholder mínimo: o nome CVMatch e uma linha de descrição dentro de um Card do shadcn/ui. Sem botões nem campos. O texto da interface está em português.
- **R5** — Existe uma função só de servidor que devolve a `GROQ_API_KEY` lida do `.env`. É o único sítio do código que lê essa variável.
- **R6** — A app arranca e a página inicial abre mesmo sem `GROQ_API_KEY` definida. A falta da chave só dá erro quando a função de R5 é chamada, e esse erro não contém o valor de nenhuma variável de ambiente.
- **R7** — A chave nunca chega ao browser: não usa o prefixo `NEXT_PUBLIC_` e a função de R5 não pode ser importada por componentes de cliente.
- **R8** — `.env` é ignorado pelo git. `.env.example` mantém-se com `GROQ_API_KEY=` vazio.
- **R9** — Makefile com os alvos `help`, `install`, `dev`, `build` e `lint`.

## Fora de âmbito

- Upload de CV, campo da vaga, análise e ecrã de resultado
- Chamadas à Groq e escolha do modelo
- Prettier e testes (Vitest ou outro)
- Esqueleto ou layout do ecrã final
- Docker, CI e deploy

## Critério de concluído

- [ ] `make install` seguido de `make dev` abre a app em `localhost` sem erros.
- [ ] A página inicial mostra o placeholder com o estilo do shadcn/ui aplicado.
- [ ] `make build` termina sem erros de TypeScript.
- [ ] `make lint` termina sem erros.
- [ ] Com `GROQ_API_KEY` vazia, a app arranca e a página inicial abre na mesma.
- [ ] A chave não aparece no bundle enviado ao browser.
- [ ] `git status` não lista o `.env`.
