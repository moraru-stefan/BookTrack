import { Router } from 'express'
import { favorites } from '../controllers/library.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const favoritesRouter = Router()

favoritesRouter.get('/', requireAuth, favorites)
