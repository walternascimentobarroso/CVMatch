# CVMatch

App para candidatos: o utilizador envia o CV e a descrição de uma vaga, e recebe um score de compatibilidade com sugestões de melhoria do CV.

## Estado

Projeto ainda sem código. A stack abaixo está decidida; tudo o resto (fornecedor de LLM, persistência, autenticação, hospedagem) está em aberto e deve ser registado com `/adr` quando for decidido.

## Stack

- Next.js (App Router) full-stack, com API routes
- TypeScript
- Tailwind CSS + shadcn/ui

## Fluxo de trabalho

Qualquer funcionalidade segue esta ordem:

1. `/spec <nome>` — clarifica objetivo, requisitos e critérios de "concluído"; grava em `specs/<nome>.md`.
2. `/build <nome>` — implementa exatamente o que está na spec, sem requisitos inventados.
3. `/review-spec <nome>` — valida a implementação requisito a requisito; só fecha quando todos passarem.

Não implementar funcionalidades sem spec em `specs/`.

## Arquitetura e decisões

- `/adr` — regista em `docs/adr/` qualquer escolha técnica com alternativas reais e difícil de reverter. Antes de mudar algo estrutural, verifica se contradiz um ADR aceito.
- `/c4-diagrams` — mantém os diagramas em `docs/architecture/`. Atualiza-os quando uma spec, ADR ou mudança de código alterar sistemas externos, containers ou integrações.

## Código

- `karpathy-guidelines` — aplica ao escrever, rever ou refatorar código.
- `senior-frontend` — aplica ao criar ou refatorar componentes React/Next.js e ao organizar pastas.
- `shadcn` — estilo visual por omissão da interface. Não misturar com outras skills de design sem pedido explícito.
- `web-design-guidelines` — usa para rever acessibilidade e UX de ecrãs novos.
- `better-icons` — usa para procurar e obter ícones.

## Estrutura

```
specs/               specs das funcionalidades
docs/adr/            decisões de arquitetura
docs/architecture/   diagramas C4
```

## Privacidade

CVs contêm dados pessoais. Nunca os escrever em logs, em fixtures commitadas ou em mensagens de erro. Dados de exemplo devem ser fictícios.

## Segundo cérebro

As skills e notas reutilizáveis vivem em `~/SecondBrain`. Conhecimento específico do CVMatch fica neste repositório, não lá.
