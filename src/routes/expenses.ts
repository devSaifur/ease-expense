import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

import {
    addExpense,
    deleteExpense,
    getExpenseByUserId,
    getExpensesByUserId,
    updateExpense,
} from '../data/expense'
import { expenseSchema, expenseUpdateSchema } from '../lib/validators'
import { getUser } from '../middleware'

export const expensesRoute = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user

        try {
            const usersExpenses = await getExpensesByUserId(user.id)
            return c.json(usersExpenses, 200)
        } catch (err) {
            return c.json('Something went wrong', 400)
        }
    })
    .post('/', getUser, zValidator('json', expenseSchema), async (c) => {
        const user = c.var.user
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
    .get('/:id', getUser, async (c) => {
        const expenseId = c.req.param('id')
        const user = c.var.user

        const expense = await getExpenseByUserId({ expenseId, userId: user.id })
        if (!expense) {
            return c.json('Expense not found', 400)
        }
        return c.json(expense, 200)
    })
    .delete('/:id', getUser, async (c) => {
        const expenseId = c.req.param('id')
        const user = c.var.user

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
    .patch('/', getUser, zValidator('json', expenseUpdateSchema), async (c) => {
        const user = c.var.user

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
