# WherAds App

Frontend da plataforma WherAds — insights inteligentes sobre comportamento do consumidor para campanhas de marketing.

## Stack

- **Next.js 16** (App Router) — Framework React com SSR e routing nativo
- **TypeScript** — Tipagem estática
- **Tailwind CSS 4** — Utility-first CSS framework
- **React 19** — Biblioteca de UI

## Estrutura

```
src/
├── app/                    # App Router (rotas/páginas)
│   ├── auth/               # Páginas de autenticação
│   │   ├── login/
│   │   └── register/
│   └── (dashboard)/        # Grupo de rotas do painel (protegidas)
│       ├── campaigns/
│       └── profile/
├── components/
│   ├── ui/                 # Componentes reutilizáveis (botões, inputs, etc.)
│   └── layout/             # Componentes de layout (header, sidebar, etc.)
├── contexts/               # React Contexts (auth, etc.)
├── hooks/                  # Custom hooks
├── lib/                    # Utilitários e configurações (API client, etc.)
├── services/               # Chamadas à API organizadas por domínio
└── types/                  # Tipos TypeScript compartilhados
```

## Como rodar localmente

### Pré-requisitos

- Node.js >= 18
- npm
- Backend (wherads-api) rodando em `http://localhost:3001`

### Passos

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local

# 3. Iniciar em modo de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Scripts

| Comando         | Descrição                      |
| --------------- | ------------------------------ |
| `npm run dev`   | Inicia em modo desenvolvimento |
| `npm run build` | Compila para produção          |
| `npm run start` | Inicia build de produção       |
| `npm run lint`  | Roda ESLint                    |

## Dependências

| Pacote               | Justificativa                                     |
| -------------------- | ------------------------------------------------- |
| `next`               | Framework React com App Router, SSR e otimizações |
| `react`, `react-dom` | Biblioteca de UI (dependência do Next.js)         |

### DevDependencies

| Pacote                                                          | Justificativa                          |
| --------------------------------------------------------------- | -------------------------------------- |
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom` | Tipagem TypeScript                     |
| `tailwindcss`, `@tailwindcss/postcss`                           | Framework CSS utility-first            |
| `eslint`, `eslint-config-next`, `eslint-config-prettier`        | Linting com regras do Next.js          |
| `prettier`                                                      | Formatação automática de código        |
| `husky`                                                         | Git hooks para pré-commit e commit-msg |
| `lint-staged`                                                   | Roda linters nos arquivos staged       |
| `@commitlint/cli`, `@commitlint/config-conventional`            | Padrão Conventional Commits            |

## Git Workflow

- **Husky** — Git hooks para pré-commit (lint-staged) e commit-msg (commitlint)
- **lint-staged** — Roda ESLint + Prettier nos arquivos staged
- **Conventional Commits** — Padrão de mensagens (`feat:`, `fix:`, `chore:`, etc.)
