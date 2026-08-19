import { Router } from 'express'
import { index, search, show } from '../controllers/books.controller.js'

export const booksRouter = Router()

booksRouter.get('/', index)
booksRouter.get('/search', search)
booksRouter.get('/:id', show)
