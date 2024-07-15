import { zValidator } from '@hono/zod-validator'
import { hash, verify } from '@node-rs/argon2'
import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { generateId } from 'lucia'

import {
    createUser,
    generateEmailVerificationCode,
    getUserByEmail,
    verifyVerificationCode,
} from '../data/user'
import { lucia } from '../lib/auth'
import type { Context } from '../lib/context'
import { sendEmail } from '../lib/nodemailer'
import { loginSchema, otpSchema, registerSchema } from '../lib/validators'

export const authRoute = new Hono<Context>()
    .post('/register', zValidator('json', registerSchema), async (c) => {
        const { name, email, password } = c.req.valid('json')
        try {
            const hashedPassword = await hash(password)

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
            const verificationCode = await generateEmailVerificationCode(
                userId,
                email
            )

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

        const valid = await verify(user.password, password)
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
    .get('/me', (c) => {
        const user = c.var.user
        return c.json(user, 200)
    })
