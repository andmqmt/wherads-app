# WherAds — Plano de Entrega

## Visão Geral do Projeto

WherAds é uma plataforma full-stack de gerenciamento de campanhas publicitárias com inteligência artificial, construída como desafio técnico DirectAds.

### Stack Tecnológico

| Camada   | Tecnologia                                                 |
| -------- | ---------------------------------------------------------- |
| Backend  | NestJS 11, Prisma v7, PostgreSQL, Passport JWT             |
| Frontend | Next.js 16, React 19, Tailwind CSS 4, TypeScript 5         |
| IA       | Google Gemini (2.5-flash com fallback chain)               |
| DevOps   | Docker multi-stage, GitHub Actions CI, Husky + lint-staged |
| Design   | Liquid Glass (Apple-inspired), dark mode, i18n (pt-BR/en)  |

### Funcionalidades Implementadas

**Core:**

- Autenticação JWT (registro + login)
- CRUD completo de campanhas (criar, listar, editar, excluir)
- Alteração de status (DRAFT → ACTIVE → PAUSED → COMPLETED)

**IA (Gemini):**

- Geração automática de descrição de campanhas
- Insights estratégicos por campanha (análise de público, orçamento, canais, timing, KPIs)
- Resumo do portfólio com dicas via dashboard
- Modelo fallback chain (gemini-2.5-flash → 2.0-flash-lite → 2.0-flash → flash-latest)

**Dashboard:**

- Estatísticas (total, ativas, rascunhos, orçamento)
- Gráfico SVG donut (distribuição de orçamento por status)
- Gráfico de barras (top campanhas)
- Painel de resumo IA com dicas numeradas
- Campanhas recentes com status badges

**Bônus (9/9):**

- Docker (Dockerfile multi-stage + docker-compose)
- CI/CD (GitHub Actions com lint + build + test)
- Testes unitários (Jest)
- Validação (class-validator + whitelist)
- Seed (usuário admin + campanhas exemplo)
- Dark mode (toggle com persistência)
- Internacionalização (pt-BR + en)
- Cache (cache-manager)
- Logging (NestJS Logger)

**UX/UI:**

- Design Liquid Glass (iOS-inspired, sem noise texture)
- Logo SVG (location pin) com gradiente blue→violet
- Renderização de markdown da IA com proteção XSS
- Mobile: bottom tab bar com navegação intuitiva
- Refetch automático ao focar janela (dados sempre atualizados)

---

## 1. Plano de PR e Merge das Branches

### Estrutura de Branches Atual

```
main ← develop ← feature/auth
                ← feature/campaigns
                ← feature/bonus
```

Todas as feature branches já foram mergeadas em `develop`. Falta apenas o merge final de `develop → main`.

### Passo a passo para finalizar

#### 1.1 Merge develop → main (ambos os repos)

```bash
# Backend
cd wherads-api
git checkout main
git merge develop --no-ff -m "chore: merge develop into main for release"
git push origin main

# Frontend
cd wherads-app
git checkout main
git merge develop --no-ff -m "chore: merge develop into main for release"
git push origin main
```

#### 1.2 (Opcional) Criar tags de versão

```bash
# Em cada repo
git tag v1.0.0
git push origin v1.0.0
```

---

## 2. Provisionar Serviços no Railway

### 2.1 Criar conta no Railway

1. Acesse [railway.app](https://railway.app) e crie uma conta (GitHub login)
2. Você ganha **$5 de crédito** gratuito

### 2.2 Criar projeto

1. Clique em **New Project**
2. Dê o nome "WherAds"

### 2.3 Provisionar PostgreSQL

1. No projeto, clique em **+ New** → **Database** → **PostgreSQL**
2. Após criado, vá em **Variables** e copie a `DATABASE_URL`
   - Formato: `postgresql://user:pass@host:port/dbname`

### 2.4 Deploy do Backend (wherads-api)

1. No projeto, clique em **+ New** → **GitHub Repo** → selecione `wherads-api`
2. Configure as variáveis de ambiente em **Variables**:

| Variável         | Valor                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| `DATABASE_URL`   | (copiar do PostgreSQL provisionado)                                   |
| `JWT_SECRET`     | (gerar um segredo forte, ex: `openssl rand -base64 32`)               |
| `GEMINI_API_KEY` | (chave da API Google Gemini — opcional, IA fica desabilitada sem ela) |
| `PORT`           | `3001`                                                                |

3. Em **Settings**:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`
   - **Watch Path**: deixe padrão
   - **Branch**: `main`

4. Após o primeiro deploy, rode as migrations manualmente:
   - No Railway, abra o terminal do serviço e execute:

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

5. Verifique o Swagger em: `https://<seu-dominio-railway>/api/docs`

### 2.5 Deploy do Frontend (wherads-app)

1. No projeto, clique em **+ New** → **GitHub Repo** → selecione `wherads-app`
2. Configure as variáveis de ambiente:

| Variável              | Valor                                  |
| --------------------- | -------------------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://<dominio-do-backend-railway>` |

3. Em **Settings**:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
   - **Branch**: `main`

4. Após deploy, acesse a URL gerada pelo Railway

### 2.6 Checklist pós-deploy

- [ ] Frontend abre e renderiza a landing page
- [ ] Registro de novo usuário funciona
- [ ] Login funciona e redireciona para /dashboard
- [ ] Dashboard exibe estatísticas, gráficos e painel IA
- [ ] CRUD de campanhas funciona (criar, listar, editar, excluir)
- [ ] Alteração de status funciona (DRAFT/ACTIVE/PAUSED/COMPLETED)
- [ ] IA: geração de descrição ao criar campanha
- [ ] IA: insights estratégicos ao editar campanha
- [ ] IA: resumo do portfólio no dashboard
- [ ] Markdown da IA renderiza corretamente (headers, listas, bold, etc.)
- [ ] Dark mode funciona
- [ ] Troca de idioma (PT/EN) funciona
- [ ] Mobile: bottom tab bar navega corretamente
- [ ] Swagger acessível em /api/docs
- [ ] Seed criou o usuário admin (admin@wherads.com / 123456)

---

## 3. Alternativa: Docker Compose (local)

Caso queira demonstrar com Docker localmente:

```bash
# Na raiz de cada projeto já existe um Dockerfile
# Crie um docker-compose.yml na raiz do workspace:

version: '3.8'
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: wherads
      POSTGRES_PASSWORD: wherads123
      POSTGRES_DB: wherads
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    build: ./wherads-api
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://wherads:wherads123@db:5432/wherads
      JWT_SECRET: meu-segredo-super-secreto
      GEMINI_API_KEY: ${GEMINI_API_KEY:-}
      PORT: "3001"
    depends_on:
      - db

  app:
    build: ./wherads-app
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    depends_on:
      - api

volumes:
  pgdata:
```

```bash
docker compose up --build
# Depois, em outro terminal:
docker compose exec api npx prisma migrate deploy
docker compose exec api npx prisma db seed
```

---

## 4. Links para Entrega

Após o deploy, preencha o formulário com:

- **Email**: seu email
- **LinkedIn**: seu perfil
- **Repositório GitHub Backend**: `https://github.com/andmqmt/wherads-api`
- **Repositório GitHub Frontend**: `https://github.com/andmqmt/wherads-app`
- **Link da aplicação (deploy)**: URL gerada pelo Railway
- **Swagger**: `https://<dominio-backend>/api/docs`
