import { migrate } from 'drizzle-orm/bun-sqlite/migrator'

import { db } from '.'

const main = async () => {
    console.log('⏳ Running migrations...')

    const start = Date.now()

    try {
        migrate(db, {
            migrationsFolder: 'src/db/migrations',
        })

        const end = Date.now()

        console.log(`✅ Migrations completed in ${(end - start) / 1000}s`)

        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

// eslint-disable-next-line
main()
