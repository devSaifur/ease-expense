import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
    password: text('password').notNull(),
})

export type TUserInsert = typeof users.$inferInsert

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    incomes: many(incomes),
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
    userId: text('user_id').primaryKey(),
    email: text('email').notNull(),
    otp: integer('otp').notNull(),
    expiresAt: integer('expires', { mode: 'timestamp' }).notNull(),
})

export const accounts = sqliteTable('account', {
    id: text('id', { length: 50 })
        .primaryKey()
        .$defaultFn(() => createId()),
    balance: real('balance'),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    categoryId: text('category_id')
        .notNull()
        .references(() => accountsCategories.id),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
})

export const accountsRelations = relations(accounts, ({ one, many }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
    category: one(accountsCategories, {
        fields: [accounts.categoryId],
        references: [accountsCategories.id],
    }),
    income: many(incomes),
    expenses: many(expenses),
}))

export const accountsCategories = sqliteTable('account_category', {
    id: text('id', { length: 50 })
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text('name', { length: 50 }).notNull().unique(),
})

export const incomes = sqliteTable('income', {
    id: text('id', { length: 50 })
        .primaryKey()
        .$defaultFn(() => createId()),
    amount: real('amount').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    accountId: text('account_id')
        .notNull()
        .references(() => accounts.id),
    categoryId: text('category_id')
        .notNull()
        .references(() => incomeCategories.id),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
})

export type TIncomeInsert = typeof incomes.$inferInsert

export const incomesRelations = relations(incomes, ({ one }) => ({
    user: one(users, {
        fields: [incomes.userId],
        references: [users.id],
    }),
    account: one(accounts, {
        fields: [incomes.accountId],
        references: [accounts.id],
    }),
    category: one(incomeCategories, {
        fields: [incomes.categoryId],
        references: [incomeCategories.id],
    }),
}))

export const incomeCategories = sqliteTable('income_category', {
    id: text('id', { length: 50 })
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text('name', { length: 50 }).notNull().unique(),
})

export const expenses = sqliteTable('expense', {
    id: text('id', { length: 50 })
        .primaryKey()
        .notNull()
        .$defaultFn(() => createId()),
    amount: real('amount').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    accountId: text('account_id')
        .notNull()
        .references(() => accounts.id),
    categoryId: text('category_id')
        .notNull()
        .references(() => expenseCategories.id),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
})

export type TExpenseInsert = typeof expenses.$inferInsert

export const expensesRelations = relations(expenses, ({ one }) => ({
    user: one(users, {
        fields: [expenses.userId],
        references: [users.id],
    }),
    account: one(accounts, {
        fields: [expenses.accountId],
        references: [accounts.id],
    }),
    category: one(expenseCategories, {
        fields: [expenses.categoryId],
        references: [expenseCategories.id],
    }),
}))

export const expenseCategories = sqliteTable('expense_category', {
    id: text('id', { length: 50 })
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text('name', { length: 50 }).notNull().unique(),
})
