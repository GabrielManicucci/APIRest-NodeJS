import { app } from './app'
import { env } from './env'

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
