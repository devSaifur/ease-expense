import { db } from '../db'
import { users } from '../db/schema'
import { lucia } from '../lib/auth'
import { registerSchema } from '../lib/validators'
import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { generateId } from 'lucia'

export const authRoute = new Hono().post('/register', zValidator('json', registerSchema), async (c) => {
    const { name, email, password } = c.req.valid('json')
    try {
        const hashedPassword = await Bun.password.hash(password)
        const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) })
        if (existingUser) {
            return c.redirect('/login')
        }
        const userId = generateId(15)
        await db.insert(users).values({
            id: userId,
            name,
            email,
            password: hashedPassword,
        })
        //todo: send email verification code
        const session = await lucia.createSession(userId, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        c.header('Set-Cookie', sessionCookie.serialize(), {
            append: true,
        })
        return c.redirect('/sign-up')
    } catch (err) {
        console.error(err)
        return c.body('Something went wrong', 400)
    }
})
