# Redesign do layout

## Objetivo

Hoje a página é um cartão estreito (`max-w-3xl`) no centro do ecrã, com muito espaço desperdiçado e tudo empilhado numa coluna. O redesign aproveita a largura do ecrã e organiza a página com o estilo visual da imagem de referência (`docs/design/referencia-layout.jpg`), com tipografia mais cuidada. A funcionalidade não muda.

Esta spec substitui os requisitos R1 e R2 de `specs/resultado.md`. Os restantes (R3–R17) mantêm-se.

## Requisitos

### Estilo

- **R1** — A referência visual é `docs/design/referencia-layout.jpg`.
- **R2** — Só tema claro: fundo com gradiente suave teal/ciano, cor primária teal, cards brancos com sombra leve.
- **R3** — Fontes: Manrope para títulos e texto; Geist Mono para os números do score.

### Disposição

- **R4** — No topo há um hero com o rótulo pequeno "CORRESPONDÊNCIA CV ↔ VAGA", um título grande com uma palavra destacada em teal e um subtítulo.
- **R5** — Abaixo, um painel largo (até `max-w-7xl`) com três colunas: CV à esquerda, anel do score ao centro, vaga à direita.
- **R6** — Em mobile, as colunas empilham pela ordem CV → score → vaga, sem scroll horizontal.

### Entrada

- **R7** — O card do CV mostra o badge "CARREGADO ✓" quando há um CV em uso; o card da vaga mostra "COLADO ✓" quando a vaga tem texto.
- **R8** — A caixa de texto da vaga mantém-se sempre visível e editável (exceto durante a análise, como já definido).
- **R9** — O botão "Analisar" é grande e fica centrado por baixo das três colunas. A dica do que falta continua junto ao botão.

### Score

- **R10** — Antes de haver análise, o anel aparece vazio, com "—" e o texto "Carrega o CV e cola a vaga".
- **R11** — Depois da análise, o anel mostra o score global (0–100) preenchido proporcionalmente, com um chip "N requisitos em falta".

### Resultado (por baixo das colunas, por esta ordem)

- **R12** — Pontuações por categoria em cards pequenos, cada um com o peso ou "Não aplicável".
- **R13** — Requisitos cobertos e em falta como chips (✓ para cobertos, + para em falta), cada um com categoria, obrigatório/desejável e indicação "Parcial" quando aplicável.
- **R14** — Sugestões numa grelha de cards, cada um com ícone, trecho original → proposta, e a nota de que são propostas a rever.

### Implementação

- **R15** — Usar a skill `image-to-code-pro` com a imagem de referência, mais `senior-frontend` (estrutura de componentes) e `better-icons` (ícones).
- **R16** — Manter os componentes shadcn existentes (`Card`, `Button`), alterando tema, layout e fontes.

## Fora de âmbito

- Modo escuro.
- Pills decorativos flutuantes da referência ("Skills matched", etc.).
- Ganho percentual por sugestão ("+X%").
- Chips de competências extraídos do CV.
- Qualquer alteração à API ou à lógica de análise.

## Critério de concluído

- [ ] A 1440px o painel ocupa a largura (sem coluna estreita) e a 375px não há scroll horizontal — verificado no browser com o Playwright.
- [ ] O fluxo completo funciona: carregar CV, colar vaga, analisar, ver resultado, ver erro e tentar de novo.
- [ ] R3–R17 de `specs/resultado.md` continuam a passar.
- [ ] Fontes Manrope e Geist Mono aplicadas.
- [ ] Contraste e acessibilidade aprovados na revisão com `web-design-guidelines`.
