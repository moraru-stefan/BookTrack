import { Router } from 'express'
import { authRouter } from './auth.routes.js'
import { booksRouter } from './books.routes.js'
import { healthRouter } from './health.routes.js'

export const apiRouter = Router()

apiRouter.use(healthRouter)
apiRouter.use('/books', booksRouter)
apiRouter.use('/auth', authRouter)
