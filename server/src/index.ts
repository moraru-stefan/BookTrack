import 'dotenv/config'
import express from 'express'
import { pool } from './db.js'

const app = express()
const port = Number(process.env.PORT ?? 3000)

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'BookTrack API is running',
  })
})

app.get('/api/db-check', async (_request, response) => {
  try {
    await pool.query('SELECT 1')
    response.status(200).json({
      success: true,
      message: 'Database connection is working',
    })
  } catch (error) {
    console.error(error)
    response.status(500).json({
      success: false,
      message: 'Database connection failed',
    })
  }
})

app.listen(port, () => {
  console.log(`BookTrack API listening on http://localhost:${port}`)
})
