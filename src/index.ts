import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'
import type { Session, User } from 'lucia'

import { authMiddleware } from './middleware'
import { authRoute } from './routes/auth'
import { expensesRoute } from './routes/expenses'

const app = new Hono<{ Variables: { user: User | null; session: Session | null } }>()

app.use(logger())

const apiRoutes = app.basePath('/api').route('/expenses', expensesRoute).route('/auth', authRoute)

app.use(csrf())
app.use('*', authMiddleware)

app.get('*', serveStatic({ root: './client/dist' }))
app.get('*', serveStatic({ path: './client/dist/index.html' }))

export type ApiRoute = typeof apiRoutes

export default app
