import { Router } from 'express'
import { booksRouter } from './books.routes.js'
import { healthRouter } from './health.routes.js'

export const apiRouter = Router()

apiRouter.use(healthRouter)
apiRouter.use('/books', booksRouter)
