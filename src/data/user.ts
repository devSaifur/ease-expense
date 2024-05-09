import { db } from '../db'
import { TUserInsert, users } from '../db/schema'
import { eq } from 'drizzle-orm'

export async function getUserByEmail(email: string) {
    return await db.query.users.findFirst({ where: eq(users.email, email) })
}

export async function createUser(values: TUserInsert) {
    await db.insert(users).values(values)
}
