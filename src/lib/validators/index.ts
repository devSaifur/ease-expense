import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(16, {
        message: 'Password must be less than 16 characters',
    }),
})

export type TLoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z
    .object({
        name: z.string().min(1, { message: 'Name is required' }),
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

export const expenseSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    amount: z.number().min(1, { message: 'Amount must be at least 1 dollar' }),
    date: z.date(),
    accountId: z.string().cuid2().min(1, { message: 'Account is required' }),
    category: z.string().min(1, { message: 'Category is required' }).max(50, {
        message: 'Category must be less than 50 characters',
    }),
})

export type TExpenseSchema = z.infer<typeof expenseSchema>

export const incomeSchema = z.object({
    amount: z.number().min(1, { message: 'Amount must be at least 1 dollar' }),
    date: z.date(),
    accountId: z.string().cuid2().min(1, { message: 'Account is required' }),
    category: z.string().min(1, { message: 'Category is required' }).max(50, {
        message: 'Category must be less than 50 characters',
    }),
})

export type TIncomeSchema = z.infer<typeof incomeSchema>

export const accountSchema = z.object({
    balance: z.number().min(0, { message: 'Balance must be at least 0 dollar' }),
    category: z.string().min(1, { message: 'Category is required' }).max(50, {
        message: 'Category must be less than 50 characters',
    }),
})

export type TAccountSchema = z.infer<typeof accountSchema>
