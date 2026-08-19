import type { RequestHandler } from 'express'
import { z } from 'zod'
import { ApiError } from '../lib/ApiError.js'
import { getBookById, listBooks } from '../services/books.service.js'

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const index: RequestHandler = async (_request, response) => {
  const books = await listBooks()
  response.status(200).json({ success: true, data: books })
}

export const show: RequestHandler = async (request, response) => {
  const parsedParams = idParamSchema.safeParse(request.params)

  if (!parsedParams.success) {
    throw new ApiError(400, 'Book id must be a positive integer')
  }

  const book = await getBookById(parsedParams.data.id)

  if (!book) {
    throw new ApiError(404, 'Book not found')
  }

  response.status(200).json({ success: true, data: book })
}
