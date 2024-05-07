import { z } from 'zod'

export const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }).max(100, {
        message: 'Title must be less than 100 characters',
    }),
    amount: z.coerce.number().int().positive().min(1, { message: 'Amount is required' }),
})

export type TExpenseSchema = z.infer<typeof expenseSchema>

export const createExpenseSchema = expenseSchema.omit({ id: true })

export type TCreateExpenseSchema = z.infer<typeof createExpenseSchema>
