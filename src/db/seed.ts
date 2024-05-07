import { db } from '.'
import { users, expenses } from './schema'
import { faker } from '@faker-js/faker'

async function runSeed() {
    console.log('⏳ Running seed...')

    const start = Date.now()

    // await seedUsers()

    await seedExpenses()

    const end = Date.now()

    console.log(`✅ Seed completed in ${end - start}ms`)

    process.exit(0)
}

async function seedUsers() {
    await db.insert(users).values({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    })
}

async function seedExpenses() {
    for (let i = 0; i < 10; i++) {
        await db.insert(expenses).values({
            title: faker.lorem.sentence(),
            amount: faker.number.int({ min: 10, max: 500 }),
            userId: 'w6gfdkr68x8pxmw',
        })
    }
}

runSeed().catch((err) => {
    console.error('❌ Seed failed')
    console.error(err)
    process.exit(1)
})
