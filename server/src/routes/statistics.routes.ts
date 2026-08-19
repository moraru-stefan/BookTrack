import { Router } from 'express'
import { show } from '../controllers/statistics.controller.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const statisticsRouter = Router()

statisticsRouter.get('/', requireAuth, show)
