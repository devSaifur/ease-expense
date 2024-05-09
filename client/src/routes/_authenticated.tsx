import { userQueryOptions } from '@/lib/api'
import { Outlet, createFileRoute, useRouter } from '@tanstack/react-router'

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
  const router = useRouter()

  if (!user) {
    router.navigate({ to: '/sign-in' })
  }

  return <Outlet />
}
