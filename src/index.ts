import { authMiddleware } from './middleware'
import { authRoute } from './routes/auth'
import { expensesRoute } from './routes/expenses'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { csrf } from 'hono/csrf'
import type { Session, User } from 'lucia'

const app = new Hono<{ Variables: { user: User | null; session: Session | null } }>()

const apiRoutes = app.basePath('/api').route('/expenses', expensesRoute).route('/auth', authRoute)

app.use(csrf())
app.use('*', authMiddleware)

app.get('*', serveStatic({ path: './client/dist/index.html' }))
app.use('*', serveStatic({ root: './client/dist' }))

export type ApiRoute = typeof apiRoutes

export default app
