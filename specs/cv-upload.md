# CV Upload

## Objetivo

Carregar o CV em PDF uma vez, extrair o texto e lembrá-lo no browser, para que as análises seguintes o reutilizem sem novo upload. Cobre RF1, RF2, RF5 e RF6 de `docs/prd.md`.

## Requisitos

- **R1** — A página inicial mostra o bloco do CV no lugar do placeholder da spec `setup`. Os textos da interface estão em português.
- **R2** — O CV é carregado por um botão "Escolher ficheiro" que só aceita `.pdf`.
- **R3** — A extração do texto é feita no browser. O PDF nunca é enviado ao servidor.
- **R4** — Enquanto a extração decorre, a app mostra que está em curso.
- **R5** — Um ficheiro que não seja PDF é recusado com a mensagem de que só são aceites ficheiros PDF.
- **R6** — Um ficheiro com mais de 5 MB é recusado com uma mensagem que indica o limite.
- **R7** — Um PDF corrompido ou protegido por palavra-passe é recusado com a mensagem de que não foi possível ler o PDF.
- **R8** — Um PDF cujo texto extraído tenha menos de 200 caracteres, depois de removidos os espaços nas pontas, conta como CV digitalizado e é recusado com o aviso de formato não suportado. Esta mensagem é distinta da de R7.
- **R9** — Se o carregamento de um ficheiro falhar por qualquer dos casos de R5 a R8, o CV que já estava guardado mantém-se intacto.
- **R10** — Quando a extração corre bem, ficam guardados em `localStorage` o texto extraído, o nome do ficheiro e a data de carregamento. O PDF em si não é guardado.
- **R11** — Havendo CV guardado, a app mostra-o como CV em uso: nome do ficheiro, data de carregamento e uma pré-visualização expansível do texto extraído.
- **R12** — Ao recarregar a página ou reabrir o browser, o CV guardado aparece como CV em uso sem novo upload.
- **R13** — Escolher outro ficheiro substitui o CV em uso, sem pedir confirmação.
- **R14** — Remover apaga o CV do `localStorage`, sem pedir confirmação, e a app volta ao estado sem CV.
- **R15** — O texto do CV nunca é escrito em `console.log` nem em mensagens de erro.

## Fora de âmbito

- Campo da vaga, botão de análise e ecrã de resultado
- Chamadas à Groq
- OCR, DOCX e outros formatos
- Arrastar e largar
- Vários CVs guardados ou histórico de versões
- Testes automáticos e Vitest

## Critério de concluído

Verificação manual conduzida com o MCP do Playwright. Os PDFs de teste são fictícios e ficam na pasta `fixtures/`, ignorada pelo git.

- [ ] `make build` e `make lint` terminam sem erros.
- [ ] Carregar um PDF com texto mostra-o como CV em uso, com nome do ficheiro, data de carregamento e pré-visualização expansível.
- [ ] Recarregar a página mantém o CV em uso.
- [ ] Um PDF digitalizado mostra o aviso de formato não suportado.
- [ ] Um PDF corrompido e um PDF com palavra-passe mostram a mensagem de que não foi possível ler o PDF.
- [ ] Um ficheiro que não é PDF mostra a mensagem de que só são aceites ficheiros PDF.
- [ ] Um ficheiro acima de 5 MB mostra a mensagem com o limite.
- [ ] Depois de qualquer um destes erros, com um CV já guardado, o CV anterior continua em uso.
- [ ] Escolher outro PDF válido substitui o CV em uso.
- [ ] Remover deixa a app sem CV, e recarregar a página confirma que ficou removido.
- [ ] Nenhum pedido de rede leva o PDF ou o texto do CV ao servidor.
- [ ] A consola do browser não contém texto do CV.
