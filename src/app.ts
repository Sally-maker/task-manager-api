import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { errorHandler } from './middlewares/error.middleware.js'
import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/task.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
})

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/auth', authLimiter, authRoutes)
app.use('/tasks', taskRoutes)

app.use(errorHandler)

export default app
