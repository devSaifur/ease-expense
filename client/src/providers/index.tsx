import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Toaster } from 'sonner'

import { routeTree } from '../routeTree.gen'
import { ThemeProvider } from './theme/theme-provider'

const queryClient = new QueryClient()

const router = createRouter({ routeTree, context: { queryClient } })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
