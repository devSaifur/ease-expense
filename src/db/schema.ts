import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('user', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
    expenses: many(expenses),
}))

export const sessions = sqliteTable('session', {
    id: text('id').notNull().primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    expiresAt: integer('expires_at').notNull(),
})

export const expenses = sqliteTable('expense', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => createId()),
    title: text('title').notNull(),
    amount: integer('amount').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
    updatedAt: text('updated_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
})

export const expensesRelations = relations(expenses, ({ one }) => ({
    user: one(users, {
        fields: [expenses.userId],
        references: [users.id],
    }),
}))
