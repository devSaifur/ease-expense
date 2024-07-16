import { describe, expect, test } from 'bun:test'

import app from '../index'

describe('Accounts api', () => {
    const URL = 'http://localhost:3000/api/accounts'
    const myHeaders = new Headers()
    myHeaders.append(
        'Cookie',
        'auth_session=jfvq3yfzinx7mdmq7nvwsawimei7otppo2ny2ss4'
    )

    test('GET /accounts', async () => {
        const req = new Request(URL, {
            method: 'GET',
            headers: myHeaders,
        })
        const res = await app.fetch(req)
        expect(res.status).toBe(200)
    })

    test('POST /accounts', async () => {
        const raw = JSON.stringify({
            name: 'Test40',
            balance: 0,
        })
        const req = new Request(URL, {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        })
        const res = await app.fetch(req)
        console.log(res)
        expect(res.status).toBe(201)
    })
})
