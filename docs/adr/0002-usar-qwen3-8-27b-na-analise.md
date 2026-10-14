# ADR 0002: Usar qwen/qwen3.8-27b da Groq para a análise do CV

- **Status:** Proposto
- **Data:** 2026-10-14
- **Decisores:** Walter Nascimento
- **Origem:** [PRD](../prd.md) · [Spec analise](../../specs/analise.md)

## Contexto e problema

O PRD deixou em aberto o modelo da Groq, a escolher depois de testar o CV contra várias vagas. A spec `analise` limita a escolha a três modelos com saída estruturada em modo estrito (R21) e pede um score estável, sugestões fiéis ao CV, resultado no idioma da vaga e resposta em menos de 30 segundos (RNF5, RNF7). A rota `POST /api/analise` precisa de um modelo fixo antes da spec `resultado`.

## Critérios de decisão

- Estabilidade do score global: três execuções da mesma análise com diferença máxima de 5 pontos.
- Respostas válidas contra o esquema estrito, sem erros intermitentes.
- Requisitos e sugestões no idioma da vaga, também com CV e vaga em idiomas diferentes.
- Sugestões que só reformulam o CV, sem acrescentar factos.
- Tempo de resposta abaixo de 30 segundos.

## Opções consideradas

1. `qwen/qwen3.8-27b`
2. `openai/gpt-oss-120b`
3. `openai/gpt-oss-20b`

## Decisão

Escolhemos **`qwen/qwen3.8-27b`** porque foi o único que cumpriu a estabilidade, o idioma e o tempo na comparação final: diferença de 0 pontos entre execuções nas cinco vagas, idioma correto nas cinco vagas e no máximo 1,8 s por análise, sem respostas inválidas.

A comparação usou o script `pnpm compare-models` com um CV fictício e cinco vagas (três em português, duas em inglês), três execuções por modelo e por vaga, temperatura zero e o prompt final da spec.

| Modelo | Respostas inválidas | Diferença máxima | Idioma | Tempo máximo |
|---|---|---|---|---|
| `qwen/qwen3.8-27b` | 0 de 15 | 0 | correto | 1,8 s |
| `openai/gpt-oss-120b` | 0 de 15 | 8 | correto | 5,9 s |
| `openai/gpt-oss-20b` | 12 de 15 | 0 nas que responderam | — | 2,9 s |

### Consequências

- **Positivas:** score reprodutível; análises muito abaixo do limite de 30 s; poucos tokens por análise, o que deixa mais margem no limite por minuto da Groq.
- **Negativas:** algumas sugestões ainda sobem níveis ou cargos ("avançado" para "fluente", "orientei" para "liderança"), apesar de o prompt o proibir. Essas sugestões não são descartadas pelo código, que só verifica o trecho original (R18); a fidelidade da versão proposta depende de revisão manual.
- **Riscos e mitigação:** o modelo está em preview na Groq e pode mudar de comportamento ou ser retirado. A alternativa é **`openai/gpt-oss-120b`**, o segundo classificado: nunca deu respostas inválidas, mas oscilou 8 pontos numa vaga. A troca é uma constante em `app/api/analise/route.ts`, seguida de nova corrida do script.

### Como validar

Correr `pnpm compare-models` com o CV real e cinco vagas reais: a diferença máxima por vaga tem de ficar em 5 pontos ou menos e as sugestões têm de passar a revisão do dono do projeto. Rever a decisão se o modelo sair da Groq, se a estabilidade passar de 5 pontos, ou se as sugestões continuarem a inventar níveis ou cargos com o CV real.

## Prós e contras das opções

### qwen/qwen3.8-27b

- **Prós:** score estável em todas as vagas; o mais rápido; idioma correto depois do prompt final; sugestões em todas as vagas.
- **Contras:** em preview; exagera níveis de idioma e de liderança em algumas sugestões; na primeira versão do prompt errou o idioma de uma vaga em inglês e não deu sugestões em três vagas.

### openai/gpt-oss-120b

- **Prós:** fora de preview; sem respostas inválidas; idioma correto.
- **Contras:** score oscilou 8 pontos na mesma vaga; numa vaga as sugestões copiaram o texto da vaga em vez de reformular o CV; mais lento e mais caro em tokens, por usar raciocínio.

### openai/gpt-oss-20b

- **Prós:** rápido e estável quando responde.
- **Contras:** 12 de 15 respostas falharam a validação do esquema estrito do lado da Groq, o que o torna inutilizável.

## Links

- [Spec analise](../../specs/analise.md) — R3, R9, R17, R21 e R22
- [PRD](../prd.md) — RNF5, RNF6 e RNF7
- Script de comparação: `scripts/compare-models.ts`
