import app from './app.js'

const PORT = process.env.PORT ?? 3000

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set')
  process.exit(1)
}

if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL environment variable is not set')
  process.exit(1)
}

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Graceful shutdown...`)
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
