# In.orbit

- Criar package.json

```fish
npm init -y
```

- Instalação do typescript tsx e @types/node

```fish
pnpm i typescript -D
pnpm i tsx @types/node -D
```

- Criar arquivo tsconfig.json com o comando abaixo e pegar do repositório tsconfig bases do github a configuração

```fish
npx tsc --init
```

## Fastify

### Instalação Fastify

```fish
pnpm i fastify
```

### Configuração Fastify

- Criar arquivo src/http/server.ts

```ts
import { fastify } from 'fastify'

const app = fastify()

app
  .listen({
    port: 3333
  })
  .then(() => {
    console.log('HTTP server running!')
  })
```

- Criar script no package.json

```json
"dev": "tsx --env-file .env watch src/http/server.ts",
```

## Drizzle ORM

### Instalação Drizzle

```fish
pnpm i drizzle-orm
```

```fish
pnpm i drizzle-kit -D
```

### Configuração Drizzle

- Criar arquivo drizzle.config.ts

```ts
import { defineConfig } from 'drizzle-kit'
import { env } from './src/env'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './.migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
```

### Criando a tabela do banco

- Instalação do cuid2 para criar id no padrão cuid

```fish
 pnpm i @paralleldrive/cuid2
```

- Sempre deve exportar uma const que vai ser a tabela

```ts
import { createId } from '@paralleldrive/cuid2'
import { timestamp } from 'drizzle-orm/pg-core'
import { integer } from 'drizzle-orm/pg-core'
import { pgTable, text } from 'drizzle-orm/pg-core'

export const goals = pgTable('goals', {
  id: text('id')
    .primaryKey()
    // utilização do createId
    .$defaultFn(() => createId()),
  title: text('title').notNull(),
  desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
```

### Criando no banco de dados

- Criar a migration da tabela

```fish
npx drizzle-kit generate 
```

- Instalar o Postgres

```fish
pnpm i postgres
```

- Gerar a tabela no banco de dados a partir da migration criada

```fish
npx drizzle-kit migrate 
```

- Visualização da interface do drizzle

```fish
npx drizzle-kit studio 
```

- Criar script no package.json

```json
"db:generate": "npx drizzle-kit generate",
"db:migrate": "npx drizzle-kit migrate",
"db:studio": "npx drizzle-kit studio"
```

### Conexão banco de dados

- Criar arquivo src/db/index.ts

```ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '../env'

export const client = postgres(env.DATABASE_URL)
export const db = drizzle(client, { schema, logger: true })
```

### Criar seed do banco de dados

- Criar arquivo src/db/seed.ts

```ts
import { db } from '.'
import { goalCompletions, goals } from './schema'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  await db.insert(goals).values([
    { title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
    { title: 'Me exercitar', desiredWeeklyFrequency: 3 },
    { title: 'Meditar', desiredWeeklyFrequency: 1 },
  ])
}

seed()
```

- Criar script no package.json

```json
"seed": "tsx --env-file .env src/db/seed.ts",
```
