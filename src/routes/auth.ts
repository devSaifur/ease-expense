import { createUser, getUserByEmail } from '../data/user'
import { db } from '../db'
import { verifyEmail } from '../db/schema'
import { lucia } from '../lib/auth'
import { sendEmail } from '../lib/nodemailer'
import { loginSchema, registerSchema } from '../lib/validators'
import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { generateId, type User } from 'lucia'
import { z } from 'zod'

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

// note: run migrations before checking this route

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
            const expiresIn = new Date(new Date().getTime() + 5 * 60 * 1000)
            await createUser({
                id: userId,
                name,
                email,
                password: hashedPassword,
                emailVerified: expiresIn,
            })
            const otp = Math.floor(100000 + Math.random() * 900000)
            await db.insert(verifyEmail).values({ identifier: userId, otp, expiresAt: expiresIn })
            await sendEmail({ to: email, otp })

            const sessionCookie = lucia.createSessionCookie(userId)
            c.header('Set-Cookie', sessionCookie.serialize(), {
                append: true,
            })
            return c.json('Verification email sent', 200)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 400)
        }
    })
    .post('/register/verify', zValidator('json', z.coerce.number()), async (c) => {
        const otp = c.req.valid('json')
        const cookie = getCookie(c, lucia.sessionCookieName) ?? null
        if (!cookie) {
            return c.body('Invalid OTP', 400)
        }
        const [identify] = cookie.split(':')
        const otpTable = await db.query.verifyEmail.findFirst({
            where: and(eq(verifyEmail.identifier, identify), eq(verifyEmail.otp, otp)),
        })
        if (!otpTable) {
            return c.body('Invalid OTP', 400)
        }
        const hasExpired = otpTable.expiresAt < new Date()
        if (hasExpired) {
            return c.body('OTP has expired', 400)
        } else {
            await db.delete(verifyEmail).where(eq(verifyEmail.identifier, identify))
            const session = await lucia.createSession(identify, {})
            const sessionCookie = lucia.createSessionCookie(session.id)
            c.header('Set-Cookie', sessionCookie.serialize(), {
                append: true,
            })
            return c.json('Registration successful', 200)
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
