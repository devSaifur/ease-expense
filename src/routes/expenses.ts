import {
    addExpense,
    deleteExpense,
    getExpenseByUserId,
    getExpensesByUserId,
    updateExpense,
} from '../data/expense'
import { expenseSchema } from '../lib/validators'
import { getUser } from './auth'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

const app = new Hono()

export const expensesRoute = app
    .get('/', getUser, async (c) => {
        const { id } = c.var.user
        try {
            const usersExpenses = await getExpensesByUserId(id)
            return c.json({ expenses: usersExpenses }, 200)
        } catch (err) {
            return c.json('Something went wrong', 400)
        }
    })
    .post('/', getUser, zValidator('json', expenseSchema), async (c) => {
        const expense = c.req.valid('json')
        const { id } = c.var.user
        try {
            const insertedExpense = await addExpense({ ...expense, userId: id })
            return c.json({ expense: insertedExpense }, 200)
        } catch (err) {
            return c.json('Something went wrong', 400)
        }
    })
    .get('/:id', getUser, async (c) => {
        const expenseId = c.req.param('id')
        const { id } = c.var.user
        const expense = await getExpenseByUserId({ expenseId, userId: id })
        if (!expense) {
            return c.notFound()
        }
        return c.json({ expense }, 200)
    })
    .delete('/:id', getUser, async (c) => {
        const expenseId = c.req.param('id')
        const { id } = c.var.user
        try {
            const deletedExpense = await deleteExpense({ expenseId, userId: id })
            return c.json({ deletedExpense }, 200)
        } catch (err) {
            return c.json('Something went wrong', 400)
        }
    })
    .patch('/:id', getUser, zValidator('json', expenseSchema), async (c) => {
        const expenseId = c.req.param('id')
        const { id } = c.var.user
        const expense = c.req.valid('json')
        try {
            const updatedExpense = await updateExpense({ userId: id, expenseId, ...expense })
            return c.json({ expense: updatedExpense }, 200)
        } catch (err) {
            return c.json('Something went wrong', 400)
        }
    })
