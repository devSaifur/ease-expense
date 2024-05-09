import { type ApiRoute } from '@server/index'
import { hc } from 'hono/client'

const client = hc<ApiRoute>('/')
export const api = client.api
