import { fastify } from 'fastify'
import { env } from '../env'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { fastifyCors } from '@fastify/cors'

import { createGoalRoute } from './routes/create-goal'
import { getPendingGoalsRoute } from './routes/get-pending-goals'
import { createGoalCompletionRoute } from './routes/create-completion'
import { getWeekSummaryRoute } from './routes/get-week-summary'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { authenticateFromGithubRoute } from './routes/authenticate-from-github'
import { fastifyJwt } from '@fastify/jwt'
import { getProfileRoute } from './routes/get-profile'
import { getUserExperienceAndLevelRoute } from './routes/get-user-experience-and-level'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, { origin: '*' })

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'in.orbit',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(createGoalRoute)
app.register(createGoalCompletionRoute)
app.register(getPendingGoalsRoute)
app.register(getWeekSummaryRoute)
app.register(authenticateFromGithubRoute)
app.register(getProfileRoute)
app.register(getUserExperienceAndLevelRoute)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
