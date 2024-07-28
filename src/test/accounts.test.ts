import * as request from 'supertest'
import { describe, test } from 'vitest'

import app from '../index'

describe('Accounts api', () => {
    const myHeaders = {
        'Content-Type': 'application/json',
        Cookie: 'auth_session=jfvq3yfzinx7mdmq7nvwsawimei7otppo2ny2ss4',
    }

    test('GET /accounts', async () => {
        await request(app).get('/api/accounts').expect('Content-Type', /json/).expect(200)
    })

    test('POST /accounts', async () => {
        const raw = JSON.stringify({
            name: 'test200',
            balance: 100,
        })
        await request(app).post('/api/accounts').set(myHeaders).send(raw).expect('Content-Type', /json/).expect(201)
    })

    test('PATCH /accounts/:id', async () => {
        const raw = JSON.stringify({
            name: 'updated name',
            balance: 100,
            categoryId: 'imhr4ad9tjkgzrat2g0myvaq',
        })
        await request(app)
            .patch('/api/accounts/w7ne2vyt62q5ssdnl5b8ok1c')
            .set(myHeaders)
            .send(raw)
            .expect('Content-Type', /json/)
            .expect(200)
    })
})
