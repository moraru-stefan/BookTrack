import { Router } from 'express'
import { index, show } from '../controllers/books.controller.js'

export const booksRouter = Router()

booksRouter.get('/', index)
booksRouter.get('/:id', show)
