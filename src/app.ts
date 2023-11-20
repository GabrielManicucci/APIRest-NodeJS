import fastify from 'fastify'
import { knex } from './database'
import { transactionsRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyCookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.get('/allTables', async () => {
  const tables = await knex('sqlite_schema').select('*')
  return tables
})
