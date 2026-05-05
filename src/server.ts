import app from './app'

const PORT = process.env.PORT || 3000

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set')
  process.exit(1)
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
