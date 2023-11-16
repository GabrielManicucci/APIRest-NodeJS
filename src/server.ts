import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

const app = fastify()

app.register(fastifyCookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.get('/allTables', async () => {
  const tables = await knex('sqlite_schema').select('*')
  return tables
})

const start = async () => {
  try {
    await app.listen({ port: env.PORT })
    console.log('HTTP Server running in http://localhost:3333')
  } catch (err) {
    app.log.error(err)
  }
}

start()

// app
//   .listen({
//     port: env.PORT,
//   })
//   .then(() => console.log('HTTP Server running in http://localhost:3333'))
