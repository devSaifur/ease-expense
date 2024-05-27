import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { type User, generateId } from 'lucia'

import {
    createUser,
    generateEmailVerificationCode,
    getUserByEmail,
    verifyVerificationCode,
} from '../data/user'
import { lucia } from '../lib/auth'
import { sendEmail } from '../lib/nodemailer'
import { loginSchema, otpSchema, registerSchema } from '../lib/validators'

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
    if (!user.email_verified) {
        return c.json({ error: 'Email not verified' }, 400)
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
            await createUser({
                id: userId,
                name,
                email,
                password: hashedPassword,
                emailVerified: false,
            })
            const verificationCode = await generateEmailVerificationCode(userId, email)

            await sendEmail({ to: email, otp: verificationCode })

            const session = await lucia.createSession(userId, {})
            const sessionCookie = lucia.createSessionCookie(session.id)

            return c.body('Verification email sent', {
                headers: {
                    'Set-Cookie': sessionCookie.serialize(),
                },
                status: 302,
            })
        } catch (err) {
            console.error(err)
            return c.body('Something went wrong', 400)
        }
    })
    .post('/register/verify', zValidator('json', otpSchema), async (c) => {
        const { otp } = c.req.valid('json')
        const sessionId = getCookie(c, lucia.sessionCookieName) ?? null
        if (!sessionId) {
            return c.body('Invalid OTP', 400)
        }
        try {
            const { user } = await lucia.validateSession(sessionId)
            if (!user) {
                return c.body('Invalid session', 400)
            }
            const verified = await verifyVerificationCode(user, Number(otp))
            if (!verified) {
                return c.body('Invalid OTP', 400)
            }
            const session = await lucia.createSession(user.id, {})
            const sessionCookie = lucia.createSessionCookie(session.id)

            return c.body('Registration successful', {
                headers: {
                    'Set-Cookie': sessionCookie.serialize(),
                },
                status: 302,
            })
        } catch (err) {
            console.error(err)
            return c.body('Something went wrong', 400)
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
