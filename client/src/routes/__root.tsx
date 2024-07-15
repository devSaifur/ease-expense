import Navbar from '@/components/navbar'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

interface MyRouteContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouteContext>()({
  component: () => <Root />,
})

function Root() {
  return (
    <div className="relative h-screen w-full">
      <Navbar />
      <hr />
      <Outlet />
    </div>
  )
}
