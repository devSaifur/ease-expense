import { createTransport } from 'nodemailer'

const transporter = createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_APP_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
})

export async function sendEmail(to: string, otp: number) {
    const options = {
        from: process.env.EMAIL_APP_USER,
        to: to,
        subject: 'Email verification | Ease Expense',
        html: `<b>Your one time password is ${otp}</b>`,
    }

    await transporter.sendMail(options)
}
