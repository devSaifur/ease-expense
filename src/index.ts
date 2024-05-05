import app from './app'
import { logger } from 'hono/logger'

app.use('*', logger())

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

export default app
