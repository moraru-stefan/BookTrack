import type { ErrorRequestHandler } from 'express'
import { ApiError } from '../lib/ApiError.js'

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({ success: false, message: error.message })
    return
  }

  console.error(error)
  response.status(500).json({ success: false, message: 'Errore interno del server' })
}
