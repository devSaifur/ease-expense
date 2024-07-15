import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'

import { lucia } from './lib/auth'

export async function authMiddleware(c: Context, next: Next) {
    const sessionId = getCookie(c, lucia.sessionCookieName) ?? null
    if (!sessionId) {
        c.set('user', null)
        c.set('session', null)
        return next()
    }
    const { session, user } = await lucia.validateSession(sessionId)
    if (session && session.fresh) {
        c.header(
            'Set-Cookie',
            lucia.createSessionCookie(session.id).serialize(),
            {
                append: true,
            }
        )
    }
    if (!session) {
        c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), {
            append: true,
        })
    }
    if (!user?.email_verified) {
        return c.json({ error: 'Email not verified' }, 400)
    }
    c.set('user', user)
    c.set('session', session)
    return next()
}
