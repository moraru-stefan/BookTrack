import type { Response, RequestHandler } from 'express'
import { z } from 'zod'
import { ApiError } from '../lib/ApiError.js'
import { signToken } from '../lib/jwt.js'
import { AUTH_COOKIE_NAME } from '../middleware/requireAuth.js'
import {
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
} from '../services/users.service.js'

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Il nome è obbligatorio')
    .max(100, 'Il nome non può superare i 100 caratteri'),
  email: z.string().trim().toLowerCase().email('Inserisci un indirizzo email valido'),
  password: z
    .string()
    .min(8, 'La password deve avere almeno 8 caratteri')
    .max(72, 'La password non può superare i 72 caratteri'),
})

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Inserisci un indirizzo email valido'),
  password: z.string().min(1, 'Inserisci la password'),
})

function setAuthCookie(response: Response, token: string) {
  response.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE_MS,
  })
}

export const register: RequestHandler = async (request, response) => {
  const parsed = registerSchema.safeParse(request.body)

  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues.map((issue) => issue.message).join(', '))
  }

  const { name, email, password } = parsed.data

  const existing = await findUserByEmail(email)
  if (existing) {
    throw new ApiError(409, 'Email già registrata')
  }

  const user = await createUser(name, email, password)
  const token = signToken(user.id)
  setAuthCookie(response, token)

  response.status(201).json({ success: true, data: user })
}

export const login: RequestHandler = async (request, response) => {
  const parsed = loginSchema.safeParse(request.body)

  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues.map((issue) => issue.message).join(', '))
  }

  const { email, password } = parsed.data

  const user = await verifyPassword(email, password)
  if (!user) {
    throw new ApiError(401, 'Email o password non corretti')
  }

  const token = signToken(user.id)
  setAuthCookie(response, token)

  response.status(200).json({ success: true, data: user })
}

export const logout: RequestHandler = (_request, response) => {
  response.clearCookie(AUTH_COOKIE_NAME)
  response.status(200).json({ success: true, message: 'Disconnessione effettuata' })
}

export const me: RequestHandler = async (request, response) => {
  const user = await findUserById(request.userId as number)

  if (!user) {
    throw new ApiError(401, 'Autenticazione richiesta')
  }

  response.status(200).json({ success: true, data: user })
}
