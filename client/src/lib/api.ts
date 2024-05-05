import { type ApiRoute } from '../../../src/app'
import { hc } from 'hono/client'

const client = hc<ApiRoute>('/')
export const api = client.api
