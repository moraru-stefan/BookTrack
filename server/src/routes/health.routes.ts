import { Router } from 'express'
import { dbCheck, health } from '../controllers/health.controller.js'

export const healthRouter = Router()

healthRouter.get('/health', health)
healthRouter.get('/db-check', dbCheck)
