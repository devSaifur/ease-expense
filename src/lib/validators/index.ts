import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { expenses } from '../../db/schema'

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(16, {
            message: 'Password must be less than 16 characters',
        }),
})

export type TLoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(3, { message: 'Name must be at least 3 characters' })
            .max(100, {
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

export const otpSchema = z.object({
    otp: z.string().length(6, { message: 'OTP must be 6 characters' }),
})

export type TOtpSchema = z.infer<typeof otpSchema>

export const expenseSchema = createInsertSchema(expenses)
    .omit({
        userId: true,
    })
    .extend({
        id: z.string().cuid2(),
    })

export type TExpenseSchema = z.infer<typeof expenseSchema>
