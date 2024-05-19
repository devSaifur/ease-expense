import SignIn from './sign-in.lazy'
import { userQueryOptions } from '@/lib/api'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient
    const user = await queryClient.fetchQuery(userQueryOptions)
    return { user }
  },
  component: Component,
})

function Component() {
  const { user } = Route.useRouteContext()

  if (!user) {
    return <SignIn />
  }

  return <Outlet />
}
