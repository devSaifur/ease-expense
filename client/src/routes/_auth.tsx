import { userQueryOptions } from '@/lib/api'
import { Outlet } from '@tanstack/react-router'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(userQueryOptions)
    if (user) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => <Outlet />,
})
