import { api } from '@/lib/api.ts'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

function App() {
  const { data, isPending } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const res = await api.expenses.$get()
      const { expenses } = await res.json()
      return expenses
    },
  })

  return (
    <div
      className={cn('h-screen w-full bg-background font-geist text-foreground')}
    >
      hello vite
      <div>{isPending ? 'loading...' : JSON.stringify(data)}</div>
    </div>
  )
}

export default App
