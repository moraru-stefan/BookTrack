import express from 'express'

const app = express()
const port = Number(process.env.PORT ?? 3000)

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'BookTrack API is running',
  })
})

app.listen(port, () => {
  console.log(`BookTrack API listening on http://localhost:${port}`)
})
