import Navbar from '@/components/navbar'
import type { QueryClient } from '@tanstack/react-query'
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
    <div className="h-screen w-full bg-black text-white">
      <Navbar />
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  )
}
