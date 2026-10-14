# Análise

## Objetivo

Dado o texto do CV e o texto da vaga, devolver uma análise estruturada: score global, score por categoria, requisitos cobertos e em falta, e sugestões de reescrita. Inclui a escolha do modelo da Groq. Cobre RF7 a RF15 e RNF3 a RNF7 de `docs/prd.md`.

## Requisitos

### Entrada e saída

- **R1** — A rota `POST /api/analise` recebe o texto do CV e o texto da vaga em JSON e devolve a análise em JSON.
- **R2** — CV ou vaga vazios, depois de removidos os espaços nas pontas, são recusados com erro, sem chamar a Groq.
- **R3** — A chamada à Groq usa temperatura zero e saída estruturada em modo estrito.
- **R4** — A resposta da Groq é validada contra o esquema no servidor antes de ser devolvida. Uma resposta que não o cumpra é tratada como erro.
- **R5** — `GROQ_API_KEY` só é usada no servidor e nunca chega ao browser.

### O que o LLM devolve

- **R6** — A lista de requisitos da vaga. Cada requisito tem categoria (competências técnicas, experiência, formação ou idiomas), importância (obrigatório ou desejável) e estado (coberto, parcial ou em falta).
- **R7** — Quando a vaga não distingue obrigatório de desejável, o requisito conta como obrigatório.
- **R8** — As sugestões de reescrita. Cada uma tem o trecho original do CV e a versão proposta.
- **R9** — O idioma da vaga, português ou inglês. Os requisitos e as sugestões vêm nesse idioma, mesmo que o CV esteja no outro.

### O que o código calcula

O LLM classifica; os scores são sempre calculados pelo código.

- **R10** — O score de uma categoria é a percentagem coberta dos seus requisitos, de 0 a 100. Um requisito obrigatório pesa o dobro de um desejável, e um requisito parcial vale metade de um coberto.
- **R11** — Uma categoria sem nenhum requisito na vaga é marcada como não aplicável, não tem score e não entra no score global.
- **R12** — O score global é a média ponderada das categorias aplicáveis, com os pesos: competências técnicas 40, experiência 40, formação 10, idiomas 10. Os pesos são renormalizados sobre as categorias aplicáveis.
- **R13** — Os scores são arredondados a inteiros.
- **R14** — A resposta inclui os pesos usados.
- **R15** — A resposta separa os requisitos em cobertos e em falta. Os parciais aparecem em "em falta", assinalados como parciais.
- **R16** — Uma vaga sem nenhum requisito identificável devolve erro, não um score vazio.

### Sugestões

- **R17** — O prompt proíbe acrescentar experiência, tecnologias, cargos ou números que não constem do CV. As sugestões só reformulam o que já lá está.
- **R18** — Uma sugestão cujo trecho original não exista no texto do CV é descartada, e a análise segue com as restantes. A comparação ignora diferenças de espaços e quebras de linha.

### Erros e privacidade

- **R19** — Chave em falta, limite da API, timeout, resposta inválida e vaga sem requisitos devolvem erros distintos e identificáveis, para a spec `resultado` os traduzir em mensagens compreensíveis.
- **R20** — O texto do CV e da vaga nunca é escrito em logs nem em mensagens de erro.

### Modelo

- **R21** — O modelo é escolhido entre `openai/gpt-oss-120b`, `openai/gpt-oss-20b` e `qwen/qwen3.8-27b`, comparando a estabilidade do score e a qualidade das sugestões.
- **R22** — A escolha é registada com `/adr`. Se o escolhido for o `qwen/qwen3.8-27b`, o ADR regista o risco de ser um modelo em preview e o segundo classificado como alternativa.

## Fora de âmbito

- Campo da vaga, botão de análise, ecrã de resultado e estados de carregamento (spec `resultado`)
- Modelos sem modo estrito de saída estruturada
- Streaming da resposta
- Tentativas automáticas em caso de falha
- Histórico ou cache de análises
- Verificação automática de que a versão proposta não inventa factos (é feita por revisão manual)

## Critério de concluído

A parte determinística é verificada com testes Vitest, que nunca chamam a Groq. A parte que depende do LLM é verificada com um script de comparação corrido contra a API real, com o CV e cinco vagas diferentes na pasta `fixtures/`, ignorada pelo git. Pelo menos uma das vagas está num idioma diferente do CV.

- [ ] `make build` e `make lint` terminam sem erros.
- [ ] Os testes passam para o score de uma categoria, com obrigatório a valer o dobro de desejável e parcial a valer metade de coberto.
- [ ] Os testes passam para a categoria não aplicável e para a renormalização dos pesos no score global.
- [ ] Os testes passam para o descarte de sugestões cujo trecho original não existe no CV, incluindo o caso em que só diferem espaços e quebras de linha.
- [ ] O script de comparação foi corrido com os três modelos sobre as cinco vagas.
- [ ] Com o modelo escolhido, três execuções da mesma análise dão scores globais com diferença máxima de 5 pontos.
- [ ] Com o modelo escolhido, nenhuma sugestão das cinco análises contém informação que não esteja no CV, revisto pelo dono do projeto.
- [ ] Com o modelo escolhido, uma análise típica termina em menos de 30 segundos.
- [ ] Os requisitos e as sugestões vêm no idioma da vaga, incluindo na combinação de CV num idioma e vaga noutro.
- [ ] CV vazio e vaga vazia são recusados sem chamada à Groq.
- [ ] Chave em falta e resposta inválida devolvem os erros esperados.
- [ ] Nenhum log nem mensagem de erro contém texto do CV ou da vaga.
- [ ] O ADR do modelo está aceite em `docs/adr/`.
- [ ] Os diagramas em `docs/architecture/` mostram a Groq como sistema externo.
