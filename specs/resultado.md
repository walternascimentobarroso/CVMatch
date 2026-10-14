# Resultado

## Objetivo

Permitir colar a descrição de uma vaga, pedir a análise e ver o resultado no mesmo ecrã, com os estados de carregamento e erro tratados. É o passo que liga o CV guardado (spec `cv-upload`) à rota `POST /api/analise` (spec `analise`) e fecha o fluxo principal do PRD. Cobre RF3, RF4, RF16 e RF17 de `docs/prd.md`.

## Requisitos

### Disposição

- **R1** — Tudo acontece numa única página: primeiro o bloco do CV, depois o campo da vaga e o botão de análise, e por fim o resultado.
- **R2** — O cartão da página alarga o suficiente para o resultado se ler bem em ecrãs largos e continua utilizável na largura de um telemóvel, sem scroll horizontal.

### Entrada da vaga

- **R3** — Há um campo de texto com várias linhas, com rótulo, onde se cola a descrição da vaga.
- **R4** — O texto da vaga fica só no estado da página. Não é guardado no browser nem no servidor.

### Pedir a análise

- **R5** — O botão "Analisar" só fica ativo quando existem um CV em uso e uma vaga com texto (ignorando os espaços nas pontas).
- **R6** — Enquanto o botão estiver inativo, aparece junto dele um texto a dizer o que falta: o CV, a vaga, ou ambos.
- **R7** — Ao carregar no botão, a página envia à `POST /api/analise` o texto do CV guardado e o texto da vaga.

### Em curso

- **R8** — Durante a análise, o botão fica inativo e mostra um indicador de carregamento com o texto "A analisar…".
- **R9** — Enquanto a análise decorre, o campo da vaga e as ações do CV ficam bloqueados, para que a análise corresponda aos textos enviados.
- **R10** — Um resultado anterior que esteja no ecrã é retirado quando começa uma nova análise.

### Resultado

- **R11** — Aparecem o score global de 0 a 100 e os pesos usados por categoria.
- **R12** — Aparecem as quatro categorias (competências técnicas, experiência, formação, idiomas), cada uma com o seu score ou com a indicação "Não aplicável".
- **R13** — Os requisitos aparecem em duas listas, cobertos e em falta. Cada requisito mostra a categoria e se é obrigatório ou desejável. Os parciais, que vêm em "em falta", trazem a indicação de parcial.
- **R14** — As sugestões de reescrita mostram, para cada uma, o trecho original e a versão proposta, lado a lado ou um a seguir ao outro. Uma nota avisa que são propostas a rever antes de usar.
- **R15** — Uma lista vazia mostra uma mensagem curta (por exemplo, "Nenhuma sugestão") em vez de desaparecer.
- **R16** — Os rótulos da interface ficam em português. O conteúdo vindo da análise (requisitos e sugestões) aparece como vem, no idioma da vaga.
- **R17** — O resultado fica no ecrã se a vaga for editada depois, até se pedir uma nova análise.

### Erros

- **R18** — Cada código de erro da rota tem uma mensagem compreensível em português:
  - `empty_input`: falta o CV ou a vaga.
  - `missing_api_key`: a `GROQ_API_KEY` não está configurada no `.env`.
  - `rate_limit`: o limite da API foi atingido; tentar daqui a pouco.
  - `timeout`: a análise demorou demasiado.
  - `invalid_response`: o modelo devolveu uma resposta inválida.
  - `no_requirements`: não foi possível identificar requisitos na vaga.
  - Falha de rede ou resposta inesperada: mensagem genérica de erro.
- **R19** — Junto da mensagem de erro há um botão "Tentar de novo" que repete a análise com o mesmo CV e a mesma vaga.
- **R20** — Um erro não apaga o CV nem o texto da vaga.
- **R21** — Nenhuma mensagem de erro nem log no browser contém texto do CV ou da vaga.

## Fora de âmbito

- Guardar a vaga ou o resultado entre sessões
- Histórico de análises
- Copiar ou exportar as sugestões
- Editar o CV a partir das sugestões
- Traduzir os rótulos da interface para o idioma da vaga
- Cancelar uma análise em curso
- Tentativas automáticas
- Mudanças à rota `/api/analise` ou ao cálculo dos scores

## Critério de concluído

O comportamento da interface é verificado no browser com o MCP do Playwright. A API real só é chamada com dados fictícios. Os erros podem ser simulados intercetando o pedido à rota.

- [ ] `make build` e `make lint` terminam sem erros.
- [ ] Sem CV e sem vaga, o botão está inativo e o texto indica o que falta. O mesmo acontece com só um dos dois.
- [ ] Com CV e vaga, uma análise mostra "A analisar…" e depois o score global, os pesos, as quatro categorias (com "Não aplicável" quando for o caso), os requisitos cobertos e em falta (com os parciais assinalados) e as sugestões com original e proposta.
- [ ] Uma segunda vaga é analisada sem voltar a carregar o CV, e o resultado anterior é substituído.
- [ ] Cada código de erro mostra a sua mensagem. "Tentar de novo" repete a análise e o CV e a vaga continuam lá.
- [ ] Durante a análise, o campo da vaga e as ações do CV estão bloqueados.
- [ ] Na largura de um telemóvel (375 px) não há scroll horizontal.
- [ ] Nenhuma mensagem de erro nem log da consola contém texto do CV ou da vaga.
- [ ] O ecrã foi revisto com `web-design-guidelines`.
