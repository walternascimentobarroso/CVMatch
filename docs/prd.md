# PRD — CVMatch

Estado: aprovado para MVP · 2026-10-13

## Problema

Ao candidatar-me a várias vagas, não tenho forma rápida de saber até que ponto o meu CV responde ao que cada vaga pede, nem o que devia ajustar nele antes de o enviar. Fazer essa comparação à mão, vaga a vaga, é lento e inconsistente.

## Objetivo

Dar-me, em menos de um minuto, uma leitura fiável de quão compatível o meu CV é com uma vaga concreta e o que mudar no CV para essa vaga.

## Utilizador

Um único utilizador: o dono do projeto, a usar a ferramenta na sua própria máquina para as suas candidaturas. Não há outros utilizadores, perfis ou papéis.

## Fluxo principal

1. Abro a app localmente.
2. Carrego o meu CV em PDF. Se já o carreguei antes, a app reutiliza-o.
3. Colo o texto da descrição da vaga.
4. Peço a análise.
5. Vejo o score global, o score por categoria, os requisitos cobertos e em falta, e as sugestões de reescrita.
6. Colo outra vaga e repito, sem voltar a carregar o CV.

## Requisitos funcionais

### Entrada

- **RF1** — A app aceita o CV como ficheiro PDF e extrai o texto.
- **RF2** — Se o PDF não tiver texto extraível (CV digitalizado), a app avisa que o formato não é suportado e não avança para a análise.
- **RF3** — A app aceita a descrição da vaga como texto colado.
- **RF4** — A análise só pode ser pedida quando existem CV e vaga; caso contrário, a app indica o que falta.

### CV lembrado

- **RF5** — O texto extraído do CV fica guardado no browser e é reutilizado nas análises seguintes.
- **RF6** — A app mostra qual CV está em uso e permite substituí-lo ou removê-lo.

### Análise

- **RF7** — A análise devolve um score global de 0 a 100.
- **RF8** — A análise devolve um score de 0 a 100 para cada categoria: competências técnicas, experiência, formação e idiomas.
- **RF9** — O score global é a média ponderada das categorias, com mais peso em competências técnicas e experiência. Os pesos são fixos e visíveis no resultado.
- **RF10** — Se a vaga não mencionar uma categoria (por exemplo, idiomas), essa categoria é marcada como não aplicável e não entra no score global.
- **RF11** — A análise lista os requisitos da vaga separados em cobertos e em falta no CV.
- **RF12** — A análise devolve sugestões de reescrita: cada uma mostra o trecho original do CV e a versão proposta.
- **RF13** — As sugestões só reformulam o que já está no CV. Não acrescentam experiência, tecnologias, cargos nem números que não constem dele. O que falta aparece apenas em "requisitos em falta".

### Idioma

- **RF14** — CV e vaga podem estar em português ou inglês, incluindo combinações (CV num idioma, vaga noutro).
- **RF15** — O resultado, incluindo as sugestões de reescrita, é apresentado no idioma da vaga.

### Estados e erros

- **RF16** — Enquanto a análise decorre, a app mostra que está em curso.
- **RF17** — Se a análise falhar (chave em falta, limite da API, resposta inválida), a app mostra uma mensagem compreensível e permite tentar de novo sem perder o CV nem a vaga.

## Requisitos não funcionais

- **RNF1 — Execução local.** A app corre na máquina do utilizador. Não há hospedagem, autenticação nem controlo de acesso.
- **RNF2 — Sem persistência no servidor.** Não há base de dados. Nem CV, nem vaga, nem resultados são guardados no servidor ou em disco.
- **RNF3 — Privacidade.** O conteúdo do CV e da vaga nunca é escrito em logs nem em mensagens de erro. O único destino externo desses dados é a API do LLM.
- **RNF4 — Chave de API.** `GROQ_API_KEY` é lida de `.env`, usada só no servidor e nunca exposta ao browser nem commitada.
- **RNF5 — Consistência do score.** A análise usa temperatura zero e critérios explícitos por categoria, para que o mesmo CV e a mesma vaga deem scores próximos em execuções repetidas.
- **RNF6 — Saída estruturada.** A resposta do LLM é validada contra um esquema antes de ser mostrada; uma resposta que não cumpra o esquema é tratada como erro (RF17).
- **RNF7 — Tempo de resposta.** Uma análise típica termina em menos de 30 segundos.

## Fora do âmbito do MVP

- Contas, login e multiutilizador
- Histórico de análises
- Exportar o CV reescrito (PDF ou DOCX)
- Carta de apresentação
- Ler a vaga a partir de um URL
- OCR de CVs digitalizados
- CV em DOCX ou outros formatos
- Publicação online

## Decisões tomadas

| Tema | Decisão |
| --- | --- |
| Stack | Next.js (App Router) full-stack, TypeScript, Tailwind CSS, shadcn/ui |
| Fornecedor de LLM | Groq |
| Persistência | Nenhuma no servidor; CV guardado no browser |
| Autenticação | Nenhuma |
| Hospedagem | Nenhuma; execução local |

## Decisões em aberto

- **Modelo da Groq.** Escolher depois de testar dois ou três modelos com o CV real, comparando a qualidade das sugestões e a estabilidade do score. Registar com `/adr`.
- **Pesos das categorias.** Definir os valores exatos na spec da análise.

## Critérios de sucesso

- Consigo analisar o meu CV contra uma vaga, do início ao resultado, sem ler documentação.
- Consigo analisar uma segunda vaga sem voltar a carregar o CV.
- Repetir a mesma análise três vezes dá scores globais com diferença máxima de 5 pontos.
- Nenhuma sugestão de reescrita contém informação que não esteja no CV, verificado em pelo menos cinco análises com vagas diferentes.
- Um PDF digitalizado produz o aviso de formato não suportado, não um resultado vazio ou errado.

## Specs previstas

Cada uma segue o fluxo `/spec` → `/build` → `/review-spec`.

1. `setup` — projeto Next.js inicializado, com shadcn/ui e leitura de `.env`.
2. `cv-upload` — carregar o PDF, extrair texto, lembrar no browser (RF1, RF2, RF5, RF6).
3. `analise` — chamada ao LLM, esquema de saída, scores e regras das sugestões (RF7–RF15, RNF3–RNF7).
4. `resultado` — ecrã de entrada da vaga e apresentação do resultado, com estados e erros (RF3, RF4, RF16, RF17).
