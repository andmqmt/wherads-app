# WherAds — Roteiro de Defesa Técnica

> Guia para a entrevista técnica de ~15-30 minutos. Estruturado para demonstrar domínio consciente de cada decisão.

---

## 1. Abertura e Demo (~5 min)

### Demo ao vivo (compartilhar tela)

1. **Landing page** — Mostrar interface limpa, botões de Entrar/Criar conta
2. **Registro** — Criar nova conta (mostrar validação de campos)
3. **Login** — Entrar com a conta recém-criada
4. **Campanhas** — Criar, editar status, excluir uma campanha
5. **Dark mode** — Alternar tema (botão no header)
6. **i18n** — Alternar idioma PT-BR ↔ EN (botão no header)
7. **Swagger** — Abrir `/api/docs` e mostrar os endpoints documentados
8. **Perfil** — Mostrar tela de perfil com data localizada

---

## 2. Arquitetura e Organização (~5 min)

### Backend — Clean Architecture

> "Organizei o backend em **Clean Architecture por módulo**(auth, campaign). Cada módulo tem 4 camadas: domain, application, infrastructure e presentation."

**Por que Clean Architecture?**

- As camadas internas (domain, application) **não dependem de frameworks**. Posso trocar Prisma por TypeORM sem tocar nos use cases
- Facilita testes — os use cases recebem abstrações (repositórios abstratos), logo testo com mocks simples
- O projeto fica organizado por **feature**, não por tipo de arquivo — mais fácil de navegar conforme cresce

**Fluxo de uma request:**

```
Controller → Use Case → Repository (abstrato) → PrismaRepository (implementação)
```

**Exemplo concreto:**

- `CreateCampaignUseCase` recebe `CampaignRepository` (classe abstrata)
- Em produção, o NestJS injeta `PrismaCampaignRepository`
- Em testes, injeto um mock manual

### Frontend — Estrutura do Next.js App Router

> "O frontend usa App Router com route groups. As rotas protegidas ficam no grupo `(dashboard)`, que tem um layout próprio com Header e ProtectedRoute."

- **Contexts** para auth, tema e i18n — estado global sem libs externas
- **Services** como camada de acesso à API — qualquer componente chama `campaignService.list()`, facilitando troca de implementação
- **Componentes UI** desacoplados — Button, Input, Select, StatusBadge reutilizáveis

---

## 3. Justificativa de Dependências (~5 min)

### Backend (produção)

| Pacote                                            | Por quê?                                                                                                                                                                                   | Alternativas consideradas                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| **@nestjs/\*** (core, common, platform-express)   | Framework obrigatório do desafio. Escolhi Express por ser o padrão e mais estável que Fastify no ecossistema NestJS                                                                        | Fastify (mais performático, mas menos compatível com middlewares Express)             |
| **@nestjs/config**                                | Validação de env vars no boot. Se faltar `DATABASE_URL`, o app **não sobe** em vez de falhar em runtime                                                                                    | dotenv puro (sem validação, mais propenso a bugs em produção)                         |
| **@nestjs/swagger**                               | Requisito do desafio (`/api/docs`). Geração automática via decorators nos DTOs                                                                                                             | Swagger manual com YAML (mais trabalho, menos type-safe)                              |
| **@nestjs/jwt + @nestjs/passport + passport-jwt** | Autenticação JWT com guard nativo do NestJS. `@nestjs/passport` integra o Passport como guard reutilizável                                                                                 | Implementação manual de middleware JWT (mais código, menos padronizado)               |
| **@prisma/client + @prisma/adapter-pg + pg**      | ORM obrigatório. Prisma v7 usa o **adapter pattern** — o client não conecta diretamente, recebe um adapter de driver (`PrismaPg` com `pg`). Isso permite trocar o driver sem mudar queries | Prisma v6 (sem adapter, conexão direta — menos flexível)                              |
| **bcryptjs**                                      | Hash de senhas com bcrypt. Versão JS pura, sem dependência de compilação nativa (funciona sem `node-gyp` em qualquer ambiente)                                                             | `bcrypt` nativo (precisa compilar C++, pode falhar em Alpine/Docker)                  |
| **class-validator + class-transformer**           | Validação de DTOs com decorators. Integração nativa com `ValidationPipe` do NestJS — valida automaticamente no controller                                                                  | Zod (ótimo, mas integração com NestJS pipes é menos direta)                           |
| **@nestjs/cache-manager + cache-manager**         | Cache em memória para listagem de campanhas. Evita queries repetitivas ao banco no endpoint mais acessado                                                                                  | Redis (overhead desnecessário para MVP), implementação manual (mais código sem ganho) |
| **rxjs**                                          | Dependência obrigatória do NestJS (interceptors, pipes internos usam Observables)                                                                                                          | Não há alternativa — é core do NestJS                                                 |
| **reflect-metadata**                              | Dependência do sistema de decorators do TypeScript. Necessário para DI do NestJS funcionar                                                                                                 | Não há alternativa                                                                    |

### Backend (dev)

| Pacote                                                  | Por quê?                                                                                           |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **ESLint + typescript-eslint + eslint-config-prettier** | Linting com regras TypeScript. `eslint-config-prettier` desativa regras que conflitam com Prettier |
| **Prettier**                                            | Formatação automática. Configuração única para todo o time                                         |
| **Husky**                                               | Roda hooks no `pre-commit` (lint-staged) e `commit-msg` (commitlint)                               |
| **lint-staged**                                         | Roda ESLint + Prettier **só nos arquivos staged** — commit rápido                                  |
| **@commitlint/cli + config-conventional**               | Garante padrão Conventional Commits. Rejeita commits como "fix bug" sem prefixo                    |
| **Jest + ts-jest + @nestjs/testing**                    | Framework de testes. `ts-jest` transpila TypeScript, `@nestjs/testing` cria módulos isolados       |

### Frontend (produção)

| Pacote                | Por quê?                                        |
| --------------------- | ----------------------------------------------- |
| **next**              | Framework obrigatório. Versão 16 com App Router |
| **react + react-dom** | Biblioteca de UI (dependência do Next.js)       |

> "Notem que o frontend tem apenas **3 dependências de produção**. Não instalei nenhuma lib de UI, state management ou fetching. Tailwind é devDependency (processado no build). Usei Context API nativo do React para auth, tema e i18n — sem Redux ou Zustand."

### Frontend (dev)

| Pacote                                                   | Por quê?                                                                           |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Tailwind CSS 4 + @tailwindcss/postcss**                | CSS utility-first. v4 com PostCSS plugin — sem necessidade de `tailwind.config.js` |
| **ESLint + eslint-config-next + eslint-config-prettier** | Linting com regras específicas do Next.js (acessibilidade, imports, etc.)          |
| **Prettier, Husky, lint-staged, commitlint**             | Mesmo pipeline de qualidade do backend                                             |

---

## 4. Decisões Técnicas Chave (~3 min)

### Por que dois repositórios separados?

> "Mantive backend e frontend em repos separados para deploy independente. No Railway, cada serviço faz deploy a partir do seu repo. Também facilita CI/CD — mudança no frontend não triggera pipeline do backend."

### Por que Clean Architecture no backend e não MVC padrão?

> "O NestJS já incentiva módulos. Adicionei as camadas de domain e application para que os **use cases não dependam do Prisma** nem do Express. Se amanhã precisar trocar o ORM, mudo apenas a camada de infrastructure."

### Por que não usei lib de i18n (next-intl, react-i18next)?

> "Para o escopo do MVP (2 idiomas, ~40 chaves), uma lib adicionaria overhead desnecessário. Criei um dicionário tipado com `as const` + um Context. Zero dependências extras, type-safe, e funciona perfeitamente para o tamanho do projeto."

### Por que cache em memória e não Redis?

> "Para um MVP, cache in-memory com TTL é suficiente. Redis adicionaria mais um serviço para provisionar e monitorar. Se o projeto escalar para múltiplas instâncias, a migração para Redis é simples — só mudo o `store` no `CacheModule.register()`."

### Por que Prisma v7 com adapter?

> "A v7 introduziu o adapter pattern. Em vez do Prisma gerenciar a conexão internamente, ele recebe um adapter (`PrismaPg`) que encapsula o driver `pg`. Isso dá mais controle sobre connection pooling e permite trocar o driver sem mudar as queries."

---

## 5. Uso de IA (~3 min)

> "Usei GitHub Copilot como assistente durante todo o desenvolvimento. A IA ajudou principalmente em:"

### Onde a IA foi mais útil:

- **Scaffolding inicial** — Gerar a estrutura de arquivos e boilerplate dos módulos
- **DTOs e validações** — Gerar decorators de validação com class-validator
- **Tailwind classes** — Sugerir combinações de classes para responsividade
- **Configurações** — ESLint flat config, jest config com ts-jest, Dockerfile multi-stage

### Onde precisei intervir manualmente:

- **Prisma v7 adapter** — A IA gerava código de Prisma v6 (sem adapter). Precisei consultar a documentação oficial e ajustar o `PrismaService` para usar `PrismaPg`
- **React 19 + Next.js 16** — Algumas APIs mudaram (ex: `<Context value={}> em vez de <Context.Provider value={}>`). Corrigi manualmente
- **ESLint flat config** — Incompatibilidades entre plugins. Ajustei rules manualmente
- **Clean Architecture** — A organização em camadas e as abstrações foram decisão minha — a IA tende a gerar código acoplado ao framework

### Minha visão sobre IA no desenvolvimento:

> "A IA acelera a escrita de código repetitivo e boilerplate, mas as **decisões arquiteturais, de segurança e de performance** precisam vir do desenvolvedor. Eu reviso cada trecho gerado e entendo o que ele faz antes de aceitar."

---

## 6. Diferenciais Implementados (~2 min)

| Diferencial   | O que foi feito                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Docker**    | Dockerfiles multi-stage para ambos os projetos (build + runtime separados para imagem menor)                                      |
| **Testes**    | Testes unitários dos use cases (register, login, create-campaign, delete-campaign) com mocks manuais                              |
| **CI/CD**     | GitHub Actions em ambos os repos — lint, build, testes no push/PR                                                                 |
| **Validação** | Frontend (validação em forms) + Backend (class-validator + ValidationPipe)                                                        |
| **Seed**      | Script de seed com usuário admin e 5 campanhas de exemplo                                                                         |
| **Dark mode** | Toggle com Context API, persistência em localStorage, respeita `prefers-color-scheme`                                             |
| **i18n**      | Suporte pt-BR e EN com dicionário tipado, toggle no header, sem libs externas                                                     |
| **Cache**     | `@nestjs/cache-manager` no endpoint de listagem de campanhas (TTL 30s)                                                            |
| **Logging**   | `LoggingInterceptor` (tempo de resposta de cada request) + `AllExceptionsFilter` (tratamento global de erros com log estruturado) |

---

## 7. Perguntas Frequentes (se perguntarem)

### "Por que não usou Zustand/Redux?"

> "O estado global do app é simples: user, token, tema, locale. Context API resolve sem overhead de lib adicional. Se crescer, migraria para Zustand pela API mínima."

### "Por que não usou TanStack Query/SWR?"

> "O CRUD é simples e direto. Criei services que fazem `fetch` com a abstração da api.ts. Para um MVP, não justifica a dependência. Se adicionasse paginação, infinite scroll ou cache inteligente, aí sim usaria React Query."

### "Por que não fez testes no frontend?"

> "Priorizei testes unitários dos use cases no backend — onde está a lógica de negócio. No frontend, a lógica é majoritariamente de UI/fluxo. Com mais tempo, adicionaria testes com Testing Library nos forms e fluxos críticos."

### "Como escalaria o projeto?"

> "Backend: Redis para cache, fila com BullMQ para processamento assíncrono, API Gateway se adicionar microserviços. Frontend: ISR/SSR para SEO, CDN para assets, compartilhar tipos via pacote npm monorepo."

### "O que melhoraria com mais tempo?"

> "Paginação na listagem, upload de imagens (S3), testes e2e com Playwright, rate limiting, refresh token, logs com nível (Winston/Pino), observabilidade (Sentry)."

---

## 8. Checklist pré-entrevista

- [ ] Deploy funcionando (Railway)
- [ ] Swagger acessível em `/api/docs`
- [ ] Seed rodou (admin@wherads.com funciona)
- [ ] Dark mode toggle funciona
- [ ] i18n toggle funciona
- [ ] Registro + Login + CRUD completo funciona
- [ ] READMEs atualizados com todas as dependências
- [ ] Repositórios públicos no GitHub
- [ ] Testar em mobile (responsividade)
