# ADR 0001: Usar pdfjs-dist para extrair o texto do CV no browser

- **Status:** Proposto
- **Data:** 2026-10-13
- **Decisores:** Walter Nascimento
- **Origem:** [PRD](../prd.md) · [Spec cv-upload](../../specs/cv-upload.md)

## Contexto e problema

A spec `cv-upload` exige que o texto do CV seja extraído do PDF no browser, sem enviar o ficheiro ao servidor (R3), em linha com RNF2 e RNF3 do PRD. A mesma spec pede mensagens distintas para um PDF corrompido ou protegido por palavra-passe (R7) e para um PDF digitalizado sem texto (R8). A biblioteca tem de ser escolhida antes do `/build cv-upload`, porque condiciona a configuração do Next.js e a forma como os erros são tratados.

## Critérios de decisão

- Distinguir PDF corrompido, PDF com palavra-passe e PDF sem texto, para cumprir R7 e R8.
- Controlo sobre a ordem do texto extraído, porque CVs com duas colunas são o caso em que a extração sai baralhada.
- Poucos intermediários numa dependência que lê dados pessoais.
- Simplicidade de código e de configuração.

## Opções consideradas

1. `pdfjs-dist`
2. `unpdf`
3. `react-pdf`

## Decisão

Escolhemos **`pdfjs-dist`** porque expõe diretamente os erros de PDF inválido e de palavra-passe, o que serve R7 e R8 sem depender de como um wrapper os repassa, e porque devolve a posição de cada item de texto, o que permite ajustar a ordem em CVs com colunas. É a biblioteca original, sem intermediário.

### Consequências

- **Positivas:** tratamento de erros alinhado com as mensagens da spec; possibilidade de corrigir a ordem do texto; correções de leitura de PDFs chegam sem esperar por um wrapper.
- **Negativas:** é preciso configurar o worker do pdf.js no Next.js e garantir que a biblioteca só é carregada no cliente; o texto tem de ser juntado página a página no nosso código; o bundle do cliente fica mais pesado.
- **Riscos e mitigação:** a compatibilidade com Next.js 16.4 e React 19.3 não foi testada à data desta decisão. Se a configuração do worker se revelar inviável no `/build cv-upload`, este ADR é revisto antes de avançar, com `unpdf` como alternativa imediata.

### Como validar

No `/review-spec cv-upload`: o CV real do utilizador é extraído com o texto na ordem de leitura, visível na pré-visualização, e os PDFs de teste corrompido, com palavra-passe e digitalizado produzem cada um a mensagem prevista na spec. Rever a decisão se a ordem do texto continuar errada depois de ajustada, ou se a configuração do worker partir numa atualização do Next.js.

## Prós e contras das opções

### pdfjs-dist

- **Prós:** biblioteca de referência, mantida pela Mozilla; erros tipados para PDF inválido e para palavra-passe; acesso às posições dos itens de texto.
- **Contras:** configuração do worker no Next.js; mais código para juntar o texto; bundle maior.

### unpdf

- **Prós:** extração de texto numa única chamada; sem worker para configurar; menos código.
- **Contras:** embute a sua própria cópia do pdf.js, que anda atrás da original; os erros chegam por um nível de indireção; a chamada simples devolve o texto já juntado, com menos margem para corrigir colunas.

### react-pdf

- **Prós:** integração pronta com React.
- **Contras:** destina-se a mostrar PDFs, e a spec só usa o texto; exige o mesmo worker do pdf.js; peso a mais sem ganho.

## Links

- [Spec cv-upload](../../specs/cv-upload.md) — R3, R7 e R8
- [PRD](../prd.md) — RF1, RF2, RNF2 e RNF3
