import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const { data, isPending } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const res = await api.expenses.$get()
      if (!res.ok) {
        throw new Error('Failed to fetch expenses')
      }
      const { expenses } = await res.json()
      return expenses
    },
  })

  return (
    <div className={cn('')}>
      hello vite ok
      <div>
        <pre>{isPending ? 'loading...' : JSON.stringify(data)}</pre>
      </div>
    </div>
  )
}
