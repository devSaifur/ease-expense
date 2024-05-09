import { createUser, getUserByEmail } from '../data/user'
import { lucia } from '../lib/auth'
import { loginSchema, registerSchema } from '../lib/validators'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { generateId, type User } from 'lucia'

type Env = {
    Variables: {
        user: User
    }
}

export const getUser = createMiddleware<Env>(async (c, next) => {
    const sessionId = getCookie(c, lucia.sessionCookieName) ?? null
    if (!sessionId) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
    const { session, user } = await lucia.validateSession(sessionId)
    if (session && session.fresh) {
        c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize(), {
            append: true,
        })
    }
    if (!session) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
    c.set('user', user)
    await next()
})

export const authRoute = new Hono()
    .post('/register', zValidator('json', registerSchema), async (c) => {
        const { name, email, password } = c.req.valid('json')
        try {
            const hashedPassword = await Bun.password.hash(password)
            const existingUser = await getUserByEmail(email)
            if (existingUser) {
                return c.body('User already exists', 400)
            }
            const userId = generateId(15)
            await createUser({ id: userId, name, email, password: hashedPassword })
            //todo: send email verification code
            const session = await lucia.createSession(userId, {})
            const sessionCookie = lucia.createSessionCookie(session.id)
            c.header('Set-Cookie', sessionCookie.serialize(), {
                append: true,
            })
            return c.json('Registration successful', 200)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 400)
        }
    })
    .post('/login', zValidator('json', loginSchema), async (c) => {
        const { email, password } = c.req.valid('json')
        const user = await getUserByEmail(email)
        if (!user) {
            return c.body('User not found', 404)
        }
        const valid = await Bun.password.verify(password, user.password)
        if (!valid) {
            return c.body('Invalid password', 400)
        }
        const session = await lucia.createSession(user.id, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        c.header('Set-Cookie', sessionCookie.serialize(), {
            append: true,
        })
        return c.body('Login successful', 200)
    })
    .post('/logout', async (c) => {
        const sessionId = getCookie(c, lucia.sessionCookieName) ?? null
        if (!sessionId) {
            return c.body('No session found', 400)
        }
        const sessionCookie = lucia.createBlankSessionCookie()
        c.header('Set-Cookie', sessionCookie.serialize(), {
            append: true,
        })
        return c.body('Logout successful', 200)
    })
    .get('/me', getUser, (c) => {
        const user = c.var.user
        return c.json({ user }, 200)
    })
