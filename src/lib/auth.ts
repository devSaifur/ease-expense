import { db } from '../db'
import { sessions, users } from '../db/schema'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { Lucia } from 'lucia'

const adapter = new DrizzleSQLiteAdapter(db, sessions, users)

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === 'production',
        },
    },
    getUserAttributes: (attributes) => {
        return {
            // attributes has the type of DatabaseUserAttributes
            name: attributes.name,
            email: attributes.email,
            email_verified: attributes.emailVerified,
        }
    },
})

// IMPORTANT!
declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia
        DatabaseUserAttributes: DatabaseUserAttributes
    }
}
interface DatabaseUserAttributes {
    name: string
    email: string
    emailVerified: boolean
}
