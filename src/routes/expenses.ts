import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import {
    addExpense,
    deleteExpense,
    getExpenseByUserId,
    getExpensesByUserId,
    updateExpense,
} from '../data/expense'
import type { Context } from '../lib/context'
import { expenseSchema, expenseUpdateSchema } from '../lib/validators'

export const expensesRoute = new Hono<Context>()
    .get('/', async (c) => {
        const user = c.get('user')

        if (!user) {
            return c.json('Unauthorized', 401)
        }

        try {
            const usersExpenses = await getExpensesByUserId(user.id)
            return c.json(usersExpenses, 200)
        } catch (err) {
            return c.json('Something went wrong', 400)
        }
    })
    .post('/', zValidator('json', expenseSchema), async (c) => {
        const user = c.get('user')

        if (!user) {
            return c.json('Unauthorized', 401)
        }

        const expense = c.req.valid('json')
        try {
            const insertedExpense = await addExpense({
                ...expense,
                userId: user.id,
            })
            return c.json(insertedExpense, 200)
        } catch (err) {
            return c.json('Something went wrong', 400)
        }
    })
    .get('/:id', async (c) => {
        const expenseId = c.req.param('id')
        const user = c.get('user')

        if (!user) {
            return c.json('Unauthorized', 401)
        }

        const expense = await getExpenseByUserId({ expenseId, userId: user.id })
        if (!expense) {
            return c.json('Expense not found', 400)
        }
        return c.json(expense, 200)
    })
    .delete('/:id', async (c) => {
        const expenseId = c.req.param('id')
        const user = c.get('user')

        if (!user) {
            return c.json('Unauthorized', 401)
        }
        try {
            const deletedExpense = await deleteExpense({
                expenseId,
                userId: user.id,
            })
            return c.json(deletedExpense, 200)
        } catch (err) {
            return c.json('Something went wrong', 400)
        }
    })
    .patch('/', zValidator('json', expenseUpdateSchema), async (c) => {
        const user = c.get('user')

        if (!user) {
            return c.json('Unauthorized', 401)
        }
        const expense = c.req.valid('json')
        try {
            const updatedExpense = await updateExpense({
                userId: user.id,
                ...expense,
            })
            return c.json(updatedExpense, 200)
        } catch (err) {
            return c.json('Something went wrong', 400)
        }
    })
