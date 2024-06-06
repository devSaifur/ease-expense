import { userQueryOptions } from '@/lib/api'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'

const SignIn = lazy(() => import('./sign-in.lazy'))

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
    return (
      <Suspense>
        <SignIn />
      </Suspense>
    )
  }

  return <Outlet />
}
