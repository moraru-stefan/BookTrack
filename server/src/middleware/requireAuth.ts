import type { RequestHandler } from 'express'
import { ApiError } from '../lib/ApiError.js'
import { verifyToken } from '../lib/jwt.js'

declare global {
  namespace Express {
    interface Request {
      userId?: number
    }
  }
}

export const AUTH_COOKIE_NAME = 'booktrack_token'

export const requireAuth: RequestHandler = (request, _response, next) => {
  const token = request.cookies?.[AUTH_COOKIE_NAME]

  if (!token) {
    throw new ApiError(401, 'Autenticazione richiesta')
  }

  try {
    const payload = verifyToken(token)
    request.userId = payload.userId
    next()
  } catch {
    throw new ApiError(401, 'Sessione non valida o scaduta')
  }
}
