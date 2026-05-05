import request from 'supertest'

process.env.DATABASE_URL = 'postgresql://fake:fake@localhost:5432/fake'
process.env.JWT_SECRET = 'test-secret'

const { default: app } = await import('../src/app.js')

describe('POST /auth/register', () => {
  it('should return 400 when body has invalid fields', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'not-an-email', password: '123' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })
})

describe('POST /auth/login', () => {
  it('should return 400 when body is empty', async () => {
    const res = await request(app).post('/auth/login').send({})

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })
})

describe('GET /tasks', () => {
  it('should return 401 when no Bearer token is provided', async () => {
    const res = await request(app).get('/tasks')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Token not provided')
  })
})

