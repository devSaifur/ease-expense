import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './src/db/migrations',
    dialect: 'sqlite',
    dbCredentials: {
        // @ts-ignore
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
})
