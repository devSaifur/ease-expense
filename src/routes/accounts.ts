import { zValidator } from '@hono/zod-validator'
import { and, eq, getTableColumns } from 'drizzle-orm'
import { Hono } from 'hono'

import { db } from '../db'
import { accounts, accountsCategories } from '../db/schema'
import { accountCreateSchema, accountUpdateSchema } from '../lib/validators'
import { getUser } from '../middleware'

export const accountsRoute = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user
        try {
            const usersAccounts = await db.query.accounts.findMany({
                where: eq(accounts.userId, user.id),
                with: {
                    category: true,
                },
                columns: {
                    userId: false,
                    categoryId: false,
                },
            })
            if (!usersAccounts || usersAccounts.length === 0) {
                // creating a default account for the user
                await db.transaction(async (trx) => {
                    const [accountCategory] = await trx
                        .insert(accountsCategories)
                        .values({
                            name: 'Cash',
                        })
                        .returning({ id: accountsCategories.id })

                    await trx.insert(accounts).values({
                        userId: user.id,
                        categoryId: accountCategory.id,
                        balance: 0,
                    })
                })
                const usersAccounts = await db.query.accounts.findMany({
                    where: eq(accounts, user.id),
                    with: {
                        category: true,
                    },
                    columns: {
                        userId: false,
                        categoryId: false,
                    },
                })
                return c.json(usersAccounts, 200)
            }
            return c.json(usersAccounts, 200)
        } catch (err) {
            return c.json('Something went wrong', 500)
        }
    })
    .post('/', getUser, zValidator('form', accountCreateSchema), async (c) => {
        const user = c.var.user
        const { name, balance } = c.req.valid('form')

        try {
            const [newAccount] = await db.transaction(async (trx) => {
                const [accountCategory] = await trx
                    .insert(accountsCategories)
                    .values({
                        name,
                    })
                    .returning({ id: accountsCategories.id })

                const { userId, ...rest } = getTableColumns(accounts)

                return await trx
                    .insert(accounts)
                    .values({
                        userId: user.id,
                        categoryId: accountCategory.id,
                        balance,
                    })
                    .returning({ ...rest })
            })

            return c.json(newAccount, 200)
        } catch (err) {
            return c.json('Something went wrong', 500)
        }
    })
    .put(
        '/:id',
        getUser,
        zValidator('form', accountUpdateSchema),
        async (c) => {
            const user = c.var.user
            const { name, ...account } = c.req.valid('form')
            const accountId = c.req.param('id')

            try {
                const [updatedAccount] = await db.transaction(async (trx) => {
                    await trx
                        .update(accountsCategories)
                        .set({ name })
                        .where(eq(accountsCategories.id, account.categoryId))

                    const { userId, ...rest } = getTableColumns(accounts)

                    return await trx
                        .update(accounts)
                        .set({
                            ...account,
                            userId: user.id,
                        })
                        .where(
                            and(
                                eq(accounts.id, accountId),
                                eq(accounts.userId, user.id)
                            )
                        )
                        .returning({
                            ...rest,
                        })
                })

                return c.json(updatedAccount, 200)
            } catch (err) {
                return c.json('Something went wrong', 500)
            }
        }
    )
