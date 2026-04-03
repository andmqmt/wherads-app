# WherAds App

Frontend da plataforma WherAds — insights inteligentes sobre comportamento do consumidor para campanhas de marketing.

## Stack

- **Next.js 16** (App Router) — Framework React com SSR e routing nativo
- **TypeScript 5** — Tipagem estática
- **Tailwind CSS 4** — Utility-first CSS framework
- **React 19** — Biblioteca de UI

## Estrutura

```
src/
├── app/                    # App Router (rotas/páginas)
│   ├── auth/               # Páginas de autenticação
│   │   ├── login/
│   │   └── register/
│   └── (dashboard)/        # Grupo de rotas protegidas
│       ├── dashboard/      # Página inicial do painel
│       ├── campaigns/      # CRUD de campanhas
│       │   ├── new/        # Criar campanha
│       │   ├── design/     # Design de campanha com IA
│       │   └── [id]/       # Editar campanha
│       ├── kpis/           # KPIs e analytics com IA
│       └── profile/        # Perfil do usuário
├── components/
│   ├── ui/                 # Componentes reutilizáveis (Button, Input, Select, StatusBadge)
│   └── layout/             # Componentes de layout (Header, ProtectedRoute)
├── contexts/               # React Contexts (auth, tema, i18n)
├── lib/                    # Utilitários (API client, dicionários i18n)
├── services/               # Chamadas à API organizadas por domínio
└── types/                  # Tipos TypeScript compartilhados
```

## Funcionalidades

- **Autenticação** — Login e registro com JWT, proteção de rotas
- **CRUD de Campanhas** — Criar, listar, editar e excluir campanhas
- **Dark Mode** — Toggle com persistência em localStorage + respeita `prefers-color-scheme`
- **i18n** — Suporte pt-BR e EN com dicionário tipado, toggle no header
- **IA (Gemini)** — Design de campanhas e análise de KPIs com inteligência artificial
- **Responsivo** — Layout adaptável para mobile e desktop
- **Estados visuais** — Loading, erro, vazio e sucesso em todas as telas

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

### Com Docker

```bash
docker build -t wherads-app .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:3001 wherads-app
```

## Scripts

| Comando         | Descrição                      |
| --------------- | ------------------------------ |
| `npm run dev`   | Inicia em modo desenvolvimento |
| `npm run build` | Compila para produção          |
| `npm run start` | Inicia build de produção       |
| `npm run lint`  | Roda ESLint                    |

## Dependências

### Produção

| Pacote               | Justificativa                                     |
| -------------------- | ------------------------------------------------- |
| `next`               | Framework React com App Router, SSR e otimizações |
| `react`, `react-dom` | Biblioteca de UI (dependência do Next.js)         |

> **Nota:** Apenas 3 dependências de produção. Não foram adicionadas libs de state management, UI kit ou fetching — tudo foi implementado com APIs nativas do React (Context API, fetch).

### Desenvolvimento

| Pacote                                                          | Justificativa                                        |
| --------------------------------------------------------------- | ---------------------------------------------------- |
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom` | Tipagem TypeScript para Node.js e React              |
| `tailwindcss`, `@tailwindcss/postcss`                           | Framework CSS utility-first (processado no build)    |
| `eslint`, `eslint-config-next`, `eslint-config-prettier`        | Linting com regras específicas do Next.js            |
| `prettier`                                                      | Formatação automática de código                      |
| `husky`                                                         | Git hooks para pré-commit e commit-msg               |
| `lint-staged`                                                   | Roda linters nos arquivos staged                     |
| `@commitlint/cli`, `@commitlint/config-conventional`            | Enforce de Conventional Commits nas mensagens de git |

## Decisões Técnicas

- **Context API** em vez de Zustand/Redux — o estado global é simples (auth, tema, i18n), não justifica dependência extra
- **i18n sem lib externa** — para 2 idiomas e ~40 chaves, um dicionário tipado com `as const` resolve sem overhead
- **Services layer** — abstração de chamadas à API (`authService`, `campaignService`) facilita manutenção e possível troca de implementação
- **Route groups** — `(dashboard)` agrupa rotas protegidas com layout compartilhado (Header + ProtectedRoute)

## Diferenciais

- ✅ Docker (Dockerfile multi-stage)
- ✅ CI/CD (GitHub Actions — lint + build)
- ✅ Dark mode (toggle + persistência + prefers-color-scheme)
- ✅ Internacionalização (pt-BR e EN, sem libs externas)
- ✅ Validação de formulários
- ✅ Interface responsiva
