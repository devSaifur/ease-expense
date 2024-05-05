import { expensesRoute } from './routes/expenses'
import { Hono } from 'hono'

const app = new Hono()

app.route('/api/expenses', expensesRoute)

export default app
