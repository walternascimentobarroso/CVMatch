.DEFAULT_GOAL := help

.PHONY: help
help: ## Lista os comandos disponíveis
	@awk 'BEGIN {FS = ":.*## "} /^[a-z-]+:.*## / {printf "  \033[0;36m%-10s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: install
install: ## Instala as dependências
	pnpm install

.PHONY: dev
dev: ## Corre a app em desenvolvimento
	pnpm dev

.PHONY: build
build: ## Gera o build de produção
	pnpm build

.PHONY: lint
lint: ## Corre o ESLint
	pnpm lint

.PHONY: test
test: ## Corre os testes
	pnpm test

.PHONY: compare
compare: ## Compara os modelos da Groq com as fixtures
	pnpm compare-models
