import { zValidator } from '@hono/zod-validator'
import { and, eq, getTableColumns } from 'drizzle-orm'
import { Hono } from 'hono'

import { db } from '../db'
import { accounts } from '../db/schema'
import { accountSchema } from '../lib/validators'
import { getUser } from '../middleware'

export const accountsRoute = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user
        try {
            const usersAccounts = await db.query.accounts.findMany({
                where: eq(accounts.userId, user.id),
                columns: {
                    userId: false,
                },
            })
            return c.json(usersAccounts, 200)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 500)
        }
    })
    .get('/:id', getUser, async (c) => {
        const accountId = c.req.param('id')
        const user = c.var.user

        try {
            const account = await db.query.accounts.findFirst({
                where: and(eq(accounts.id, accountId), eq(accounts.userId, user.id)),
                columns: {
                    userId: false,
                },
            })

            if (!account) {
                return c.json('Account not found', 400)
            }

            return c.json(account, 200)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 500)
        }
    })
    .post('/', zValidator('json', accountSchema), getUser, async (c) => {
        const values = c.req.valid('json')
        const user = c.var.user

        try {
            const { userId, ...rest } = getTableColumns(accounts)

            const [newAccount] = await db
                .insert(accounts)
                .values({
                    ...values,
                    userId: user.id,
                })
                .returning({ ...rest })

            return c.json(newAccount, 201)
        } catch (err) {
            return c.json('Something went wrong', 500)
        }
    })
    .patch('/:id', zValidator('json', accountSchema), getUser, async (c) => {
        const accountId = c.req.param('id')
        const values = c.req.valid('json')
        const user = c.var.user

        try {
            const { userId, ...rest } = getTableColumns(accounts)

            const [updatedAccount] = await db
                .update(accounts)
                .set({
                    ...values,
                    userId: user.id,
                })
                .where(and(eq(accounts.id, accountId), eq(accounts.userId, user.id)))
                .returning({
                    ...rest,
                })

            return c.json(updatedAccount, 202)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 500)
        }
    })
    .delete('/:id', getUser, async (c) => {
        const accountId = c.req.param('id')
        const user = c.var.user

        try {
            const { userId, ...rest } = getTableColumns(accounts)

            const [deletedAccount] = await db
                .delete(accounts)
                .where(and(eq(accounts.id, accountId), eq(accounts.userId, user.id)))
                .returning({
                    ...rest,
                })

            return c.json(deletedAccount, 204)
        } catch (err) {
            console.error(err)
            return c.json('Something went wrong', 500)
        }
    })
