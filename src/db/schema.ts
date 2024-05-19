import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
    password: text('password').notNull(),
})

export type TUserInsert = typeof users.$inferInsert

export const usersRelations = relations(users, ({ many }) => ({
    expenses: many(expenses),
}))

export const sessions = sqliteTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    expiresAt: integer('expires_at').notNull(),
})

export const verifyEmail = sqliteTable('verify_email', {
    userId: text('user_id').unique().primaryKey(),
    email: text('email').notNull(),
    otp: integer('otp').notNull(),
    expiresAt: integer('expires', { mode: 'timestamp' }).notNull(),
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
    date: integer('date', { mode: 'timestamp' }).notNull(),
})

export type TExpenseInsert = typeof expenses.$inferInsert

export const expensesRelations = relations(expenses, ({ one }) => ({
    user: one(users, {
        fields: [expenses.userId],
        references: [users.id],
    }),
}))
