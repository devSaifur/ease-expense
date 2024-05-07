import Navbar from '@/components/navbar'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
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