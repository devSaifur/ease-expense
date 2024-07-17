import { describe, expect, test } from 'bun:test'

import app from '../index'

describe('Accounts api', () => {
    const URL = 'http://localhost:3000/api/accounts'
    const myHeaders = new Headers({
        'Content-Type': 'application/json',
        Cookie: 'auth_session=jfvq3yfzinx7mdmq7nvwsawimei7otppo2ny2ss4',
    })

    test('GET /accounts', async () => {
        const req = new Request(URL, {
            method: 'GET',
        })
        const res = await app.request(req)
        expect(res.status).toBe(401)
        expect(await res.json()).toStrictEqual({ error: 'Unauthorized' })
    })

    test('GET /accounts', async () => {
        const req = new Request(URL, {
            method: 'GET',
            headers: myHeaders,
        })
        const res = await app.request(req)
        expect(res.status).toBe(200)
    })

    test('POST /accounts', async () => {
        const raw = JSON.stringify({
            name: 'test200',
            balance: 100,
        })
        const req = new Request(URL, {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        })
        const res = await app.request(req)
        expect(res.status).toBe(201)
    })

    test('PATCH /accounts/:id', async () => {
        const raw = JSON.stringify({
            name: 'updated name',
            balance: 100,
            categoryId: 'imhr4ad9tjkgzrat2g0myvaq',
        })
        const req = new Request(`${URL}/w7ne2vyt62q5ssdnl5b8ok1c`, {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
        })
        const res = await app.request(req)
        expect(res.status).toBe(202)
        expect(await res.json()).toEqual({
            id: 'w7ne2vyt62q5ssdnl5b8ok1c',
            balance: 100,
            categoryId: 'imhr4ad9tjkgzrat2g0myvaq',
        })
    })
})
