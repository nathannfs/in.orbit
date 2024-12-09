import z from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .optional()
    .default('production'),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),

  JWT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)