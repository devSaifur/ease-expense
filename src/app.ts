import { expensesRoute } from './routes/expenses'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

const app = new Hono()

const apiRoutes = app.basePath('/api').route('/expenses', expensesRoute)

app.use('*', serveStatic({ root: './client/dist' }))
app.get('*', serveStatic({ path: './client/dist/index.html' }))

export default app

export type ApiRoute = typeof apiRoutes
