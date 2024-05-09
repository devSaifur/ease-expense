import { lucia } from './lib/auth'
import { authRoute } from './routes/auth'
import { expensesRoute } from './routes/expenses'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { getCookie } from 'hono/cookie'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'
import type { Session, User } from 'lucia'

const app = new Hono<{
    Variables: {
        user: User | null
        session: Session | null
    }
}>()

app.use('*', logger())
app.use(csrf())

app.get('*', serveStatic({ path: './client/dist/index.html' }))
app.use('*', serveStatic({ root: './client/dist' }))

app.use('*', async (c, next) => {
    const sessionId = getCookie(c, lucia.sessionCookieName) ?? null
    if (!sessionId) {
        c.set('user', null)
        c.set('session', null)
        return next()
    }
    const { session, user } = await lucia.validateSession(sessionId)
    if (session && session.fresh) {
        c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize(), {
            append: true,
        })
    }
    if (!session) {
        c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), {
            append: true,
        })
    }
    c.set('user', user)
    c.set('session', session)
    return next()
})

const apiRoutes = app.basePath('/api').route('/expenses', expensesRoute).route('/auth', authRoute)

export type ApiRoute = typeof apiRoutes

export default app
