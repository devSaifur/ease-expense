import { db } from '.'
import { expenses } from './schema'

const mokedExpenses = [
    {
        title: 'Groceries',
        amount: 100,
        userId: 'z1x28kkdyibl4si',
    },
    {
        title: 'Rent',
        amount: 500,
        userId: 'z1x28kkdyibl4si',
    },
    {
        title: 'Gas',
        amount: 50,
        userId: 'z1x28kkdyibl4si',
    },
    {
        title: 'Groceries',
        amount: 100,
        userId: 'w6gfdkr68x8pxmw',
    },
    {
        title: 'Rent',
        amount: 500,
        userId: 'w6gfdkr68x8pxmw',
    },
    {
        title: 'Gas',
        amount: 50,
        userId: 'w6gfdkr68x8pxmw',
    },
]

async function runSeed() {
    console.log('⏳ Running seed...')

    const start = Date.now()

    await seedExpenses()

    const end = Date.now()

    console.log(`✅ Seed completed in ${end - start}ms`)

    process.exit(0)
}

async function seedExpenses() {
    for (let i = 0; i < mokedExpenses.length; i++) {
        await db.insert(expenses).values(mokedExpenses[i])
    }
}

runSeed().catch((err) => {
    console.error('❌ Seed failed')
    console.error(err)
    process.exit(1)
})
