import { Router } from 'express'
import { authRouter } from './auth.routes.js'
import { booksRouter } from './books.routes.js'
import { favoritesRouter } from './favorites.routes.js'
import { healthRouter } from './health.routes.js'
import { libraryRouter } from './library.routes.js'
import { statisticsRouter } from './statistics.routes.js'

export const apiRouter = Router()

apiRouter.use(healthRouter)
apiRouter.use('/books', booksRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/library', libraryRouter)
apiRouter.use('/favorites', favoritesRouter)
apiRouter.use('/statistics', statisticsRouter)
