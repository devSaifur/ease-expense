import { createExpenseSchema } from '../lib/validators'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

type Expense = {
    id: number
    title: string
    amount: number
}

const fakeExpenses: Expense[] = [
    { id: 1, title: 'Groceries', amount: 200 },
    { id: 2, title: 'Rent', amount: 1000 },
    { id: 3, title: 'Utilities', amount: 500 },
]

export const expensesRoute = new Hono()
    .get('/', (c) => {
        return c.json({ expenses: fakeExpenses })
    })
    .post('/', zValidator('json', createExpenseSchema), (c) => {
        const expense = c.req.valid('json')
        fakeExpenses.push({ id: fakeExpenses.length + 1, ...expense })
        return c.json(expense)
    })
    .get('/:id{[0-9]+}', (c) => {
        const id = Number.parseInt(c.req.param('id'))
        const expense = fakeExpenses.find((e) => e.id === id)
        if (!expense) {
            return c.notFound()
        }
        return c.json({ expense })
    })
    .delete('/:id{[0-9]+}', (c) => {
        const id = Number.parseInt(c.req.param('id'))
        const index = fakeExpenses.findIndex((e) => e.id === id)
        if (index === -1) {
            return c.notFound()
        }
        fakeExpenses.splice(index, 1)
        return c.json({ id })
    })
