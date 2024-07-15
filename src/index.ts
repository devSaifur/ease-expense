import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'

import { authMiddleware } from './middleware'
import { authRoute } from './routes/auth'
import { expensesRoute } from './routes/expenses'

const app = new Hono()

app.use(logger())
app.use(csrf())

app.use('*', authMiddleware)

const apiRoutes = app
    .basePath('/api')
    .route('/expenses', expensesRoute)
    .route('/auth', authRoute)

app.use('*', serveStatic({ root: './client/dist' }))

export type ApiRoute = typeof apiRoutes

export default app
