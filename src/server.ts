import app from './app.js'
import logger from './utils/logger.js'

const PORT = process.env.PORT ?? 3000

if (!process.env.JWT_SECRET) {
  logger.fatal('JWT_SECRET environment variable is not set')
  process.exit(1)
}

if (!process.env.DATABASE_URL) {
  logger.fatal('DATABASE_URL environment variable is not set')
  process.exit(1)
}

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`)
})

const shutdown = (signal: string) => {
  logger.info(`Received ${signal}. Graceful shutdown...`)
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
