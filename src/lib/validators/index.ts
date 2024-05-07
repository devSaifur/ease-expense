import { z } from 'zod'

export const expenseSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }).max(100, {
        message: 'Title must be less than 100 characters',
    }),
    amount: z.coerce.number().int().positive().min(1, { message: 'Amount is required' }),
})

export type TExpenseSchema = z.infer<typeof expenseSchema>

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(16, {
        message: 'Password must be less than 16 characters',
    }),
})

export type TLoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z
    .object({
        name: z.string().min(3, { message: 'Name must be at least 3 characters' }).max(100, {
            message: 'Name must be less than 100 characters',
        }),
        email: z.string().email({ message: 'Invalid email' }),
        password: z
            .string()
            .min(6, { message: 'Password must be at least 6 characters' })
            .max(16, { message: 'Password must be less than 16 characters' }),
    })
    .refine(({ name, email, password }) => name && email && password, {
        message: 'Name, email and password are required',
        path: ['name', 'email', 'password'],
    })

export type TRegisterSchema = z.infer<typeof registerSchema>
