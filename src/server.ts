import { app } from './app'
import { env } from './env'

const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
      host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost',
    })
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
