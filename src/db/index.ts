import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import * as schema from './schema'

<<<<<<< HEAD
const client = createClient({ url: process.env.DATABASE_URL })
=======
const sqlite = new Database('local.db')
>>>>>>> parent of f1c2318 (move from bun to node)

export const db = drizzle(sqlite, { schema })
