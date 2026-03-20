.PHONY: help install dev build lint clean format type-check test setup

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
NC     := \033[0m # No Color

help: ## Show this help message
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	pnpm install

setup: install ## Setup project (install deps and create .env files)
	@echo "$(GREEN)Setting up project...$(NC)"
	@if [ ! -f .env.local ]; then \
		echo "$(YELLOW)Creating .env.local from .env.example...$(NC)"; \
		cp .env.example .env.local 2>/dev/null || echo "$(YELLOW)No .env.example found, skipping...$(NC)"; \
	fi
	@if [ ! -f apps/ekza/.env.local ]; then \
		echo "$(YELLOW)Creating apps/ekza/.env.local from .env.example...$(NC)"; \
		cp .env.example apps/ekza/.env.local 2>/dev/null || echo "$(YELLOW)No .env.example found, skipping...$(NC)"; \
	fi
	@echo "$(GREEN)Setup complete!$(NC)"
	@echo "$(YELLOW)Don't forget to fill in your environment variables in .env.local files$(NC)"

dev: ## Start both applications in development mode
	@echo "$(GREEN)Starting development servers...$(NC)"
	@echo "$(YELLOW)Checking for running processes on ports 3000 and 3001...$(NC)"
	@lsof -ti:3000,3001 2>/dev/null | xargs kill -9 2>/dev/null || true
	@sleep 1
	@echo "$(YELLOW)Wotori will be available at http://localhost:3000$(NC)"
	@echo "$(YELLOW)Ekza will be available at http://localhost:3001$(NC)"
	pnpm dev

dev-wotori: ## Start only Wotori app (port 3000)
	@echo "$(GREEN)Starting Wotori development server...$(NC)"
	cd apps/wotori && pnpm dev

dev-ekza: ## Start only Ekza app (port 3001)
	@echo "$(GREEN)Starting Ekza development server...$(NC)"
	cd apps/ekza && pnpm dev

build: ## Build all applications
	@echo "$(GREEN)Building all applications...$(NC)"
	pnpm build

build-wotori: ## Build only Wotori app
	@echo "$(GREEN)Building Wotori...$(NC)"
	cd apps/wotori && pnpm build

build-ekza: ## Build only Ekza app
	@echo "$(GREEN)Building Ekza...$(NC)"
	cd apps/ekza && pnpm build

lint: ## Lint all code
	@echo "$(GREEN)Linting code...$(NC)"
	pnpm lint

lint-fix: ## Lint and fix all code
	@echo "$(GREEN)Linting and fixing code...$(NC)"
	pnpm lint --fix || true

type-check: ## Run TypeScript type checking
	@echo "$(GREEN)Running TypeScript type check...$(NC)"
	@echo "$(YELLOW)Checking Wotori...$(NC)"
	cd apps/wotori && pnpm exec tsc --noEmit
	@echo "$(YELLOW)Checking Ekza...$(NC)"
	cd apps/ekza && pnpm exec tsc --noEmit
	@echo "$(GREEN)Type checking complete!$(NC)"

format: ## Format all code with Prettier
	@echo "$(GREEN)Formatting code...$(NC)"
	pnpm format

clean: ## Clean all build artifacts and node_modules
	@echo "$(RED)Cleaning build artifacts...$(NC)"
	pnpm clean
	@echo "$(YELLOW)Removing node_modules...$(NC)"
	rm -rf node_modules apps/*/node_modules packages/*/node_modules
	@echo "$(GREEN)Clean complete!$(NC)"

clean-build: ## Clean only build artifacts (keep node_modules)
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	pnpm clean
	rm -rf apps/*/.next apps/*/dist packages/*/dist .turbo

validate: type-check build ## Validate project (type-check, build)
	@echo "$(YELLOW)Running lint (non-blocking)...$(NC)"
	@pnpm lint || echo "$(YELLOW)Lint warnings (non-critical)$(NC)"
	@echo "$(GREEN)✓ All validations passed!$(NC)"

test-setup: ## Test project setup (install, type-check, build)
	@echo "$(GREEN)Testing project setup...$(NC)"
	@echo "$(YELLOW)Step 1: Installing dependencies...$(NC)"
	$(MAKE) install
	@echo "$(YELLOW)Step 2: Type checking...$(NC)"
	$(MAKE) type-check
	@echo "$(YELLOW)Step 3: Building...$(NC)"
	$(MAKE) build
	@echo "$(GREEN)✓ Setup test complete!$(NC)"

info: ## Show project information
	@echo "$(GREEN)Project Information:$(NC)"
	@echo "  Workspace: $(shell pwd)"
	@echo "  Node version: $(shell node --version)"
	@echo "  pnpm version: $(shell pnpm --version)"
	@echo "  Applications:"
	@echo "    - Wotori (apps/wotori) - http://localhost:3000"
	@echo "    - Ekza (apps/ekza) - http://localhost:3001"
	@echo "  Packages:"
	@echo "    - UI (@repo/ui)"
	@echo "    - locales (@repo/locales)"
	@echo "    - Config (@repo/config)"
