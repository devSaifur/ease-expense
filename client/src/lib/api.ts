import { queryOptions } from '@tanstack/react-query'
import { hc } from 'hono/client'

import type { ApiRoute } from '@server/index'

const client = hc<ApiRoute>('/')

export const api = client.api

export const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: async () => {
    const res = await api.auth.me.$get()
    if (!res.ok) {
      return null
    }
    const user = await res.json()
    return user
  },
  staleTime: Infinity,
})

export const getExpensesQueryOptions = queryOptions({
  queryKey: ['expenses'],
  queryFn: async () => {
    const res = await api.expenses.$get()
    if (!res.ok) {
      throw new Error('Failed to fetch expenses')
    }
    const expenses = await res.json()
    return expenses
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
})
