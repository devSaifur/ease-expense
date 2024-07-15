import { eq } from 'drizzle-orm'
import type { User } from 'lucia'
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo'
import { alphabet, generateRandomString } from 'oslo/crypto'

import { db } from '../db'
import { TUserInsert, users, verifyEmail } from '../db/schema'

export async function getUserByEmail(email: string) {
    return await db.query.users.findFirst({ where: eq(users.email, email) })
}

export async function createUser(values: TUserInsert) {
    await db.insert(users).values(values)
}

export async function generateEmailVerificationCode(
    userId: string,
    email: string
) {
    try {
        await db.delete(verifyEmail).where(eq(verifyEmail.userId, userId))
        const otp = Number(generateRandomString(6, alphabet('0-9')))
        await db.insert(verifyEmail).values({
            userId,
            email,
            otp,
            expiresAt: createDate(new TimeSpan(15, 'm')), // 15 minutes
        })
        return otp
    } catch (err) {
        throw err
    }
}

export async function verifyVerificationCode(user: User, otp: number) {
    const existingOtp = await db.query.verifyEmail.findFirst({
        where: eq(verifyEmail.userId, user.id),
    })
    if (!existingOtp) {
        throw new Error('Invalid OTP')
    }

    if (existingOtp.otp !== otp) {
        throw new Error('Invalid OTP')
    }

    if (existingOtp.email !== user.email) {
        throw new Error('Invalid OTP')
    }

    if (!isWithinExpirationDate(existingOtp.expiresAt)) {
        throw new Error('OTP has expired')
    }

    try {
        await db.delete(verifyEmail).where(eq(verifyEmail.userId, user.id))
        await db
            .update(users)
            .set({ emailVerified: true })
            .where(eq(users.id, user.id))
        return true
    } catch (err) {
        throw err
    }
}
