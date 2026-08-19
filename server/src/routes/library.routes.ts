import { Router } from 'express'
import { create, index, remove, setFavoriteStatus, show, update } from '../controllers/library.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const libraryRouter = Router()

libraryRouter.use(requireAuth)

libraryRouter.get('/', index)
libraryRouter.post('/', create)
libraryRouter.get('/:id', show)
libraryRouter.patch('/:id', update)
libraryRouter.delete('/:id', remove)
libraryRouter.patch('/:id/favorite', setFavoriteStatus)
