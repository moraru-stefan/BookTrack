import type { RequestHandler } from 'express'
import { z } from 'zod'
import { ApiError } from '../lib/ApiError.js'
import { getBookById, listBooks } from '../services/books.service.js'
import { searchExternalBooks } from '../services/bookSearch.service.js'

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const searchQuerySchema = z.object({
  q: z.string().trim().min(1, 'Inserisci un termine di ricerca'),
})

export const index: RequestHandler = async (_request, response) => {
  const books = await listBooks()
  response.status(200).json({ success: true, data: books })
}

export const search: RequestHandler = async (request, response) => {
  const parsedQuery = searchQuerySchema.safeParse(request.query)

  if (!parsedQuery.success) {
    throw new ApiError(400, parsedQuery.error.issues.map((issue) => issue.message).join(', '))
  }

  const results = await searchExternalBooks(parsedQuery.data.q)
  response.status(200).json({ success: true, data: results })
}

export const show: RequestHandler = async (request, response) => {
  const parsedParams = idParamSchema.safeParse(request.params)

  if (!parsedParams.success) {
    throw new ApiError(400, "L'id del libro deve essere un numero intero positivo")
  }

  const book = await getBookById(parsedParams.data.id)

  if (!book) {
    throw new ApiError(404, 'Libro non trovato')
  }

  response.status(200).json({ success: true, data: book })
}
