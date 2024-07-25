import { zValidator } from '@hono/zod-validator'
import { and, desc, eq, getTableColumns } from 'drizzle-orm'
import { Hono } from 'hono'

import { db } from '../db'
import { expenses } from '../db/schema'
import { expenseSchema } from '../lib/validators'
import { getUser } from '../middleware'

export const expensesRoute = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user

        try {
            const usersExpenses = await db.query.expenses.findMany({
                where: eq(expenses.userId, user.id),
                orderBy: desc(expenses.createdAt),
                limit: 15,
                with: {
                    category: true,
                },
                columns: {
                    userId: false,
                    categoryId: false,
                },
            })

            return c.json(usersExpenses, 200)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 400)
        }
    })
    .post('/', zValidator('json', expenseSchema), getUser, async (c) => {
        const user = c.var.user
        const expense = c.req.valid('json')

        try {
            const { userId, ...rest } = getTableColumns(expenses)

            const [insertedExpense] = await db
                .insert(expenses)
                .values({ ...expense, userId: user.id })
                .returning({ ...rest })

            return c.json(insertedExpense, 200)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 400)
        }
    })
    .get('/:id', getUser, async (c) => {
        const expenseId = c.req.param('id')
        const user = c.var.user

        const expense = await db.query.expenses.findFirst({
            where: and(
                eq(expenses.id, expenseId),
                eq(expenses.userId, user.id)
            ),
            columns: {
                userId: false,
            },
        })
        if (!expense) {
            return c.json('Expense not found', 400)
        }
        return c.json(expense, 200)
    })
    .patch('/', zValidator('json', expenseSchema), getUser, async (c) => {
        const user = c.var.user
        const expense = c.req.valid('json')

        try {
            const { userId, ...rest } = getTableColumns(expenses)

            const [updatedExpense] = await db
                .update(expenses)
                .set(expense)
                .where(
                    and(
                        eq(expenses.id, expense.id),
                        eq(expenses.userId, user.id)
                    )
                )
                .returning({ ...rest })

            return c.json(updatedExpense, 200)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 400)
        }
    })
    .delete('/:id', getUser, async (c) => {
        const expenseId = c.req.param('id')
        const user = c.var.user

        try {
            const { userId, ...rest } = getTableColumns(expenses)

            const [deletedExpense] = await db
                .delete(expenses)
                .where(
                    and(
                        eq(expenses.id, expenseId),
                        eq(expenses.userId, user.id)
                    )
                )
                .returning({ ...rest })

            return c.json(deletedExpense, 200)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 400)
        }
    })
