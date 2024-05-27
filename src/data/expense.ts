import { and, desc, eq } from 'drizzle-orm'

import { db } from '../db'
import { TExpenseInsert, expenses } from '../db/schema'

export async function getExpensesByUserId(userId: string) {
    return db.query.expenses.findMany({
        where: eq(expenses.userId, userId),
        orderBy: desc(expenses.date),
        limit: 15,
    })
}

export async function addExpense(values: TExpenseInsert) {
    const [insertedExpense] = await db.insert(expenses).values(values).returning()
    return insertedExpense
}

type ExpenseQuery = {
    userId: string
    expenseId: string
}

export async function getExpenseByUserId({ userId, expenseId }: ExpenseQuery) {
    return db.query.expenses.findFirst({
        where: and(eq(expenses.id, expenseId), eq(expenses.userId, userId)),
    })
}

export async function deleteExpense({ userId, expenseId }: ExpenseQuery) {
    const [deletedExpense] = await db
        .delete(expenses)
        .where(and(eq(expenses.id, expenseId), eq(expenses.userId, userId)))
        .returning()
    return deletedExpense
}

type UpdateExpense = {
    userId: string
    id: string
    title?: string
    amount?: number
    date?: Date
}

export async function updateExpense({ userId, id, ...values }: UpdateExpense) {
    const [updatedExpense] = await db
        .update(expenses)
        .set(values)
        .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
        .returning()
    return updatedExpense
}
