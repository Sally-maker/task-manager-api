import 'dotenv/config'
import express from 'express'
import authRoutes from './routes/auth.routes'
import taskRoutes from './routes/task.routes'
import { errorHandler } from './middlewares/error.middleware'

const app = express()

app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/auth', authRoutes)
app.use('/tasks', taskRoutes)

app.use(errorHandler)

export default app
