import { type ApiRoute } from '@server/app'
import { hc } from 'hono/client'

const client = hc<ApiRoute>('/')
export const api = client.api
