import { type ApiRoute } from '@server/index'
import { queryOptions } from '@tanstack/react-query'
import { hc } from 'hono/client'

const client = hc<ApiRoute>('/')
export const api = client.api

async function getCurrentUser() {
  const res = await api.auth.me.$get()
  if (!res.ok) {
    return null
  }
  const { user } = await res.json()
  return user
}

export const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: getCurrentUser,
  staleTime: Infinity,
})
