import 'dotenv/config'
import cookieParser from 'cookie-parser'
import express from 'express'
import { errorHandler } from './middleware/errorHandler.js'
import { apiRouter } from './routes/index.js'

const app = express()
const port = Number(process.env.PORT ?? 3000)

app.use(express.json())
app.use(cookieParser())

app.use('/api', apiRouter)

app.use((_request, response) => {
  response.status(404).json({ success: false, message: 'Not found' })
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`BookTrack API listening on http://localhost:${port}`)
})
