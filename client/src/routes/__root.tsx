import Navbar from '@/components/navbar'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

interface MyRouteContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouteContext>()({
  component: Root,
})

function Root() {
  return (
    <div className="relative h-screen w-full">
      <Navbar />
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  )
}
