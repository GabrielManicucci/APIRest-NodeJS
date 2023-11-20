import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

// Testes unitários: unidades de código
// Testes integração comunicação entre unidades
// Testes e2e: ponta a ponta, simulam um usuário operando a aplicação

// Pirâmide de teste ( Poucos testes e2e, testes de integração e muitos testes unitários)

export async function transactionsRoutes(app: FastifyInstance) {
  // hook global in transactions
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}, ${request.url}]`)
  })

  app.get('/', { preHandler: [checkSessionIdExists] }, async () => {
    const transactions = await knex('transactions').select()
    return { transactions }
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const transactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const sessionId = request.cookies.sessionId
    const { id } = transactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id,
      })
      .first()
    return { transaction }
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const sessionId = request.cookies.sessionId

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

  app.post('/', async (request, reply) => {
    // { title, amount, type: credit ou debit}

    // console.log(request.body)

    const createRequestBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['debit', 'credit']),
    })

    const { title, amount, type } = createRequestBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias em milisegundos
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
