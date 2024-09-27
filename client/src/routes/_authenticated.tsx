import { userQueryOptions } from '@/lib/api'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient
    const user = await queryClient.fetchQuery(userQueryOptions)
    if (!user) {
      throw redirect({
        to: '/sign-in',
      })
    }
  },
  component: Outlet,
})
