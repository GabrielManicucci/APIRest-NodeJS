import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { execSync } from 'child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('Should be can create new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transacion',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('Should be can list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 6000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')
    // console.log(cookies)

    const transactionsListResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    // console.log(transactionsListResponse.body)

    expect(transactionsListResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 6000,
      }),
    ])
  })

  it('Should be can to get one especific transaction by id', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 6000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const transactionsListResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    const id = transactionsListResponse.body.transactions[0].id

    const transactioById = await request(app.server)
      .get(`/transactions/${id}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(transactioById.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 6000,
      }),
    )
  })

  it('Should be can to get summary of the all transactions', async () => {
    const createCreditTransaction = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 6000,
        type: 'credit',
      })

    const cookies = createCreditTransaction.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'New transaction',
        amount: 3000,
        type: 'debit',
      })

    const summary = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    // console.log(summary.body)

    expect(summary.body.summary).toEqual({ amount: 3000 })
  })
})
