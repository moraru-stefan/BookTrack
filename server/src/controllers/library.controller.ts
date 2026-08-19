import type { RequestHandler } from 'express'
import { z } from 'zod'
import { ApiError } from '../lib/ApiError.js'
import { findOrCreateBook } from '../services/books.service.js'
import {
  addToLibrary,
  deleteLibraryEntry,
  getLibraryEntry,
  listFavorites,
  listLibrary,
  setFavorite,
  updateLibraryEntry,
} from '../services/library.service.js'

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const bookInputSchema = z.object({
  external_id: z.string().trim().min(1, "L'id esterno del libro è obbligatorio"),
  title: z.string().trim().min(1, 'Il titolo del libro è obbligatorio'),
  author: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  cover_url: z.string().trim().nullable().optional(),
  isbn: z.string().trim().nullable().optional(),
  published_date: z.string().trim().nullable().optional(),
  category: z.string().trim().nullable().optional(),
})

const createSchema = z.object({
  book: bookInputSchema,
  status: z.enum(['TO_READ', 'READING', 'READ']).default('TO_READ'),
  rating: z
    .number()
    .int()
    .min(1, 'Il voto deve essere compreso tra 1 e 5')
    .max(5, 'Il voto deve essere compreso tra 1 e 5')
    .nullable()
    .optional(),
  review: z
    .string()
    .trim()
    .max(2000, 'La recensione non può superare i 2000 caratteri')
    .nullable()
    .optional(),
  is_favorite: z.boolean().optional().default(false),
})

const updateSchema = z
  .object({
    status: z.enum(['TO_READ', 'READING', 'READ']).optional(),
    rating: z
      .number()
      .int()
      .min(1, 'Il voto deve essere compreso tra 1 e 5')
      .max(5, 'Il voto deve essere compreso tra 1 e 5')
      .nullable()
      .optional(),
    review: z
      .string()
      .trim()
      .max(2000, 'La recensione non può superare i 2000 caratteri')
      .nullable()
      .optional(),
    is_favorite: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Specifica almeno un campo da aggiornare',
  })

const favoriteSchema = z.object({
  is_favorite: z.boolean(),
})

export const index: RequestHandler = async (request, response) => {
  const entries = await listLibrary(request.userId as number)
  response.status(200).json({ success: true, data: entries })
}

export const create: RequestHandler = async (request, response) => {
  const parsed = createSchema.safeParse(request.body)

  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues.map((issue) => issue.message).join(', '))
  }

  const book = await findOrCreateBook(parsed.data.book)

  const entry = await addToLibrary(request.userId as number, book.id, {
    status: parsed.data.status,
    rating: parsed.data.rating ?? null,
    review: parsed.data.review ?? null,
    is_favorite: parsed.data.is_favorite,
  })

  response.status(201).json({ success: true, data: entry })
}

export const show: RequestHandler = async (request, response) => {
  const parsedParams = idParamSchema.safeParse(request.params)

  if (!parsedParams.success) {
    throw new ApiError(400, "L'id della voce libreria deve essere un numero intero positivo")
  }

  const entry = await getLibraryEntry(request.userId as number, parsedParams.data.id)

  if (!entry) {
    throw new ApiError(404, 'Voce non trovata nella libreria')
  }

  response.status(200).json({ success: true, data: entry })
}

export const update: RequestHandler = async (request, response) => {
  const parsedParams = idParamSchema.safeParse(request.params)

  if (!parsedParams.success) {
    throw new ApiError(400, "L'id della voce libreria deve essere un numero intero positivo")
  }

  const parsedBody = updateSchema.safeParse(request.body)

  if (!parsedBody.success) {
    throw new ApiError(400, parsedBody.error.issues.map((issue) => issue.message).join(', '))
  }

  const entry = await updateLibraryEntry(
    request.userId as number,
    parsedParams.data.id,
    parsedBody.data,
  )

  if (!entry) {
    throw new ApiError(404, 'Voce non trovata nella libreria')
  }

  response.status(200).json({ success: true, data: entry })
}

export const remove: RequestHandler = async (request, response) => {
  const parsedParams = idParamSchema.safeParse(request.params)

  if (!parsedParams.success) {
    throw new ApiError(400, "L'id della voce libreria deve essere un numero intero positivo")
  }

  const deleted = await deleteLibraryEntry(request.userId as number, parsedParams.data.id)

  if (!deleted) {
    throw new ApiError(404, 'Voce non trovata nella libreria')
  }

  response.status(204).send()
}

export const favorites: RequestHandler = async (request, response) => {
  const entries = await listFavorites(request.userId as number)
  response.status(200).json({ success: true, data: entries })
}

export const setFavoriteStatus: RequestHandler = async (request, response) => {
  const parsedParams = idParamSchema.safeParse(request.params)

  if (!parsedParams.success) {
    throw new ApiError(400, "L'id della voce libreria deve essere un numero intero positivo")
  }

  const parsedBody = favoriteSchema.safeParse(request.body)

  if (!parsedBody.success) {
    throw new ApiError(400, "'is_favorite' deve essere un valore booleano")
  }

  const entry = await setFavorite(
    request.userId as number,
    parsedParams.data.id,
    parsedBody.data.is_favorite,
  )

  if (!entry) {
    throw new ApiError(404, 'Voce non trovata nella libreria')
  }

  response.status(200).json({ success: true, data: entry })
}
