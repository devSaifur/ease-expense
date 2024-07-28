import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { logger } from 'hono/logger'

import { authMiddleware } from './middleware'
import { accountsRoute } from './routes/accounts'
import { authRoute } from './routes/auth'
import { expensesRoute } from './routes/expenses'
import { incomesRoute } from './routes/incomes'

const app = new Hono()

app.use(logger())

// app.use(csrf()) // TODO: enable csrf in production

app.use('*', authMiddleware)

const apiRoutes = app
    .basePath('/api')
    .route('/auth', authRoute)
    .route('/accounts', accountsRoute)
    .route('/incomes', incomesRoute)
    .route('/expenses', expensesRoute)

app.use('*', serveStatic({ root: './client/dist' }))

export type ApiRoute = typeof apiRoutes

console.log('Listening on port 3000')

const server = serve({
    fetch: app.fetch,
    port: 3000,
})

export default server
