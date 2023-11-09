import { knex as databaseKnex } from 'knex'

export const knex = databaseKnex({
  client: 'sqlite3',
  connection: './tmp/app.db',
})
