import { zValidator } from '@hono/zod-validator'
import { and, eq, getTableColumns, sql } from 'drizzle-orm'
import { Hono } from 'hono'

import { db } from '../db'
import { accounts, incomes } from '../db/schema'
import { incomeSchema } from '../lib/validators'
import { getUser } from '../middleware'

export const incomesRoute = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user
        try {
            const usersIncomes = await db.query.incomes.findMany({
                where: eq(incomes.userId, user.id),
                with: {
                    category: true,
                },
                columns: {
                    userId: false,
                    categoryId: false,
                },
            })

            return c.json(usersIncomes, 200)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 500)
        }
    })
    .post('/', zValidator('form', incomeSchema), getUser, async (c) => {
        const user = c.var.user
        const { accountId, categoryId, ...income } = c.req.valid('form')

        try {
            const [newIncome] = await db.transaction(async (trx) => {
                await trx
                    .update(accounts)
                    .set({
                        categoryId,
                        balance: sql`${accounts.balance} + ${income.amount}`,
                    })
                    .where(
                        and(
                            eq(accounts.id, accountId),
                            eq(accounts.userId, user.id)
                        )
                    )

                const { userId, ...rest } = getTableColumns(incomes)

                return await trx
                    .insert(incomes)
                    .values({
                        ...income,
                        userId: user.id,
                        accountId,
                        categoryId,
                    })
                    .returning({ ...rest })
            })

            return c.json(newIncome, 200)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 500)
        }
    })
    .patch('/:id', zValidator('form', incomeSchema), getUser, async (c) => {
        const user = c.var.user
        const incomeId = c.req.param('id')
        const { accountId, categoryId, ...income } = c.req.valid('form')

        try {
            const [updatedIncome] = await db.transaction(async (trx) => {
                const oldIncome = await trx.query.incomes.findFirst({
                    where: and(
                        eq(incomes.id, incomeId),
                        eq(incomes.userId, user.id)
                    ),
                    columns: {
                        amount: true,
                    },
                })
                if (!oldIncome) {
                    throw new Error('Income not found')
                }

                await trx
                    .update(accounts)
                    .set({
                        balance: sql`${accounts.balance} - ${oldIncome.amount} + ${income.amount}`,
                    })
                    .where(
                        and(
                            eq(accounts.id, accountId),
                            eq(accounts.userId, user.id)
                        )
                    )

                const { userId, ...rest } = getTableColumns(incomes)
                return await trx
                    .update(incomes)
                    .set({
                        ...income,
                        categoryId,
                        accountId,
                    })
                    .where(
                        and(
                            eq(incomes.id, incomeId),
                            eq(incomes.userId, user.id),
                            eq(incomes.accountId, accountId)
                        )
                    )
                    .returning({ ...rest })
            })

            return c.json(updatedIncome, 200)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 500)
        }
    })
