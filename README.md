# Task Manager API

API REST de gerenciamento de tarefas desenvolvida como desafio técnico backend.

---

## Desafio Técnico

### Parte 1: Lógica e Fundamentos

A função `analyzeNumbers` está em `src/utils/analysis.ts`.

Recebe uma lista de valores mistos, ignora entradas inválidas (`null`, `string`, `undefined`, `NaN`) e retorna:

```ts
analyzeNumbers([1, 2, 3, 4, 5, "a", null])
// { somaPares: 6, mediaImpares: 3 }
```

Para testar, rode na raiz do projeto:

```bash
npx tsx -e "import { analyzeNumbers } from './src/utils/analysis.ts'; console.log(analyzeNumbers([1, 2, 3, 4, 5, 'a', null]))"
```

---

### Parte 2: Conceitos

**Diferença entre REST e GraphQL:**
REST tem um endpoint por recurso, GraphQL tem um só e você pede o que precisa. REST é mais simples; GraphQL faz sentido quando mobile e web precisam de dados bem diferentes.

**O que é transação em banco de dados:**
Agrupar operações pra garantir que ou tudo acontece ou nada acontece. Clássico na transferência bancária: debitar e creditar precisam ser atômicos.

**Diferença entre autenticação e autorização:**
Autenticação é "quem é você", autorização é "o que pode fazer". Dá pra estar autenticado e não ter permissão.

**Quando usar cache e quando evitar:**
Uso quando o dado é lido muito e muda pouco. Evito quando precisa estar sempre atualizado, porque dado stale em cache é pior que sem cache.

---

### Parte 4: Integração e Qualidade

**Como rodar o projeto**

Pré-requisitos: Docker e Docker Desktop rodando.

1. Clone o repositório e acesse a pasta:
```bash
git clone https://github.com/Sally-maker/task-manager-api
cd task-manager-api
```

2. Copie o arquivo de variáveis de ambiente:
```bash
cp .env.example .env
```

3. Preencha o `.env` com um JWT_SECRET seguro:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. Suba os containers:
```bash
docker compose up -d --build
```

A API estará disponível em `http://localhost:3000`. As migrations são aplicadas automaticamente na inicialização.

**Rodar localmente sem Docker**

Requer PostgreSQL rodando e `DATABASE_URL` configurado no `.env`.

```bash
npm install
npm run prisma:migrate
npm run dev
```

**Rodar testes**
```bash
npm test
```

---

**Decisões técnicas**

- **Prisma v7 + adapter-pg**: quis usar a versão atual e o adapter dá mais controle sobre o pool
- **Refresh token opaco**: `crypto.randomBytes(64)` no banco em vez de JWT longo, consigo revogar sem blocklist
- **Rotação em `$transaction`**: delete + create atômicos pra evitar race condition
- **Zod**: evita validação manual e já tipa o dado no TypeScript
- **AppError**: separa erros esperados de inesperados no middleware
- **Rate limiting em `/auth`**: 20 req/15min, suficiente pra não deixar brute force fácil
- **Graceful shutdown**: não corta requisição no meio quando o container reinicia

**O que melhoraria com mais tempo**

- Testes cobrindo o fluxo completo de CRUD
- Refresh token em cookie httpOnly (mais seguro contra XSS)
- CORS com origem configurável por env
- Rate limiting em Redis pra múltiplas instâncias
- Endpoint `/health` verificando a conexão com o banco

**O que ficou bem**

- Camadas bem separadas, cada uma com responsabilidade clara
- Refresh token rotation em vez de JWT simples
- Todas as queries de task filtram por `userId`
- Zero credencial hardcoded, tudo validado no startup
- Healthcheck real no Postgres no Docker

**Limitações**

- Testes não cobrem o happy path completo
- CORS aberto, não iria pra produção assim
- Paginação com `skip/take`, não escala bem com volume muito alto

---

## Endpoints

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | /auth/register | Cadastrar usuário | Não |
| POST | /auth/login | Login | Não |
| POST | /auth/refresh | Renovar access token | Não |
| POST | /auth/logout | Logout | Não |
| GET | /tasks | Listar tarefas (paginação + filtro) | Sim |
| POST | /tasks | Criar tarefa | Sim |
| GET | /tasks/:id | Buscar tarefa por ID | Sim |
| PUT | /tasks/:id | Atualizar tarefa | Sim |
| DELETE | /tasks/:id | Deletar tarefa | Sim |

## Tecnologias

- Node.js + TypeScript + Express
- PostgreSQL + Prisma v7
- JWT (access token 15min, refresh token 30 dias)
- Zod, bcryptjs, cors, express-rate-limit
- Jest + Supertest
- Docker + Docker Compose
