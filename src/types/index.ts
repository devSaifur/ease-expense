import type { User } from 'lucia'

export type Env = {
    Variables: {
        user: User
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string
        }
    }
}
