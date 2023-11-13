import fastify from 'fastify'
import { knex } from './database'
import crypto from 'node:crypto'
import { env } from './env'

const app = fastify()

app.get('/allTables', async () => {
  const tables = await knex('sqlite_schema').select('*')
  return tables
})

app.get('/createTable', async () => {
  const transaction = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Teste de transação 3',
      amount: 3000,
    })
    .returning('*')
  return transaction
})

app.get('/transactionsTable', async () => {
  const transaction = await knex('transactions').select('*')
  return transaction
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('HTTP Server running in http://localhost:3333'))
