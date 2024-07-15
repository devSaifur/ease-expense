import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { generateId } from 'lucia'
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo'
import { alphabet, generateRandomString } from 'oslo/crypto'

import { db } from '../db'
import { users, verifyEmail } from '../db/schema'
import { lucia } from '../lib/auth'
import type { Context } from '../lib/context'
import { sendEmail } from '../lib/nodemailer'
import { loginSchema, otpSchema, registerSchema } from '../lib/validators'
import { getUser } from '../middleware'

export const authRoute = new Hono<Context>()
    .post('/register', zValidator('json', registerSchema), async (c) => {
        const { email, name, password } = c.req.valid('json')
        try {
            const hashedPassword = await Bun.password.hash(password)

            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email),
            })

            if (existingUser) {
                return c.body('User already exists', 400)
            }

            const userId = generateId(15)
            await db.insert(users).values({
                id: userId,
                name,
                email,
                password: hashedPassword,
                emailVerified: false,
            })
            await db.delete(verifyEmail).where(eq(verifyEmail.userId, userId))

            const otp = Number(generateRandomString(6, alphabet('0-9')))
            await db.insert(verifyEmail).values({
                userId,
                email,
                otp,
                expiresAt: createDate(new TimeSpan(15, 'm')), // 15 minutes
            })

            await sendEmail(email, otp)

            const session = await lucia.createSession(userId, {})
            c.header(
                'Set-Cookie',
                lucia.createSessionCookie(session.id).serialize(),
                { append: true }
            )

            return c.body('Verification email sent', 200)
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

            const existingOtp = await db.query.verifyEmail.findFirst({
                where: eq(verifyEmail.userId, user.id),
            })

            if (
                !existingOtp ||
                existingOtp.userId !== user.id ||
                existingOtp.email !== user.email ||
                existingOtp.otp !== Number(otp)
            ) {
                return c.body('Invalid OTP', 400)
            }

            if (!isWithinExpirationDate(existingOtp.expiresAt)) {
                return c.body('OTP has expired', 400)
            }

            await db.delete(verifyEmail).where(eq(verifyEmail.userId, user.id))
            await db
                .update(users)
                .set({ emailVerified: true })
                .where(eq(users.id, user.id))

            await lucia.invalidateUserSessions(user.id) // invalidating the temporary session

            const session = await lucia.createSession(user.id, {})
            c.header(
                'Set-Cookie',
                lucia.createSessionCookie(session.id).serialize(),
                { append: true }
            )

            return c.body('Registration successful', 200)
        } catch (err) {
            console.error(err)
            return c.body('Something went wrong', 400)
        }
    })
    .post('/login', zValidator('json', loginSchema), async (c) => {
        const { email, password } = c.req.valid('json')

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        })
        if (!user) {
            return c.body('User not found', 404)
        }

        const valid = await Bun.password.verify(password, user.password)
        if (!valid) {
            return c.body('Invalid password', 400)
        }

        const session = await lucia.createSession(user.id, {})
        c.header(
            'Set-Cookie',
            lucia.createSessionCookie(session.id).serialize(),
            { append: true }
        )

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
        return c.json(user, 200)
    })
