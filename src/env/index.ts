import { config } from 'dotenv'
import { z } from 'zod'

// console.log(process.env.NODE_ENV)

// throw new Error()

if (process.env.NODE_ENV === 'test') {
  console.log('NODE_ENV === test')
  config({ path: '.env.test', override: true })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalidad environment variable!', _env.error.format())

  throw new Error('Invalidad environment variable')
}

export const env = _env.data
