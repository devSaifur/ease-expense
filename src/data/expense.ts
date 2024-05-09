import { db } from '../db'
import { TExpenseInsert, expenses } from '../db/schema'
import { and, desc, eq } from 'drizzle-orm'

export async function getExpensesByUserId(userId: string) {
    return db.query.expenses.findMany({
        where: eq(expenses.userId, userId),
        orderBy: desc(expenses.createdAt),
        limit: 50,
    })
}

export async function addExpense(values: TExpenseInsert) {
    return db.insert(expenses).values(values).returning()
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
    return await db
        .delete(expenses)
        .where(and(eq(expenses.id, expenseId), eq(expenses.userId, userId)))
        .returning()
}
