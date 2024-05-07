import { app } from './middleware'
import { authRoute } from './routes/auth'
import { expensesRoute } from './routes/expenses'
import { serveStatic } from 'hono/bun'

const apiRoutes = app.basePath('/api').route('/expenses', expensesRoute).route('/auth', authRoute)

app.use('*', serveStatic({ root: './client/dist' }))
app.get('*', serveStatic({ path: './client/dist/index.html' }))

export default app

export type ApiRoute = typeof apiRoutes
