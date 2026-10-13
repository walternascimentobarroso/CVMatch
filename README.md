# CVMatch

Compara o teu CV com a descrição de uma vaga e mostra o quão compatíveis são.

## O que faz

1. Envias o teu CV e a descrição da vaga.
2. Recebes um score de compatibilidade.
3. Recebes sugestões concretas para melhorar o CV para essa vaga.

## Estado

Em fase inicial: o código ainda não foi criado. As instruções de instalação e execução serão adicionadas quando o projeto for inicializado.

## Stack

- [Next.js](https://nextjs.org) (App Router) full-stack
- TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)

## Documentação

| Pasta | Conteúdo |
| --- | --- |
| `specs/` | Especificação de cada funcionalidade |
| `docs/adr/` | Decisões de arquitetura (formato MADR) |
| `docs/architecture/` | Diagramas C4 em Mermaid |

## Como se trabalha neste projeto

Cada funcionalidade começa por uma spec em `specs/`, é implementada a partir dela e só é dada como concluída depois de validada contra a spec. As decisões técnicas difíceis de reverter ficam registadas em `docs/adr/`.
