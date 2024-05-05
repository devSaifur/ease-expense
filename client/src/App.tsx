import { api } from '@/lib/api.ts'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    async function getExpenses() {
      const res = await api.expenses.$get()
      const data = await res.json()
      console.log({ data })
    }
    getExpenses()
  })

  return (
    <div
      className={cn('h-screen w-full bg-background font-geist text-foreground')}
    >
      hello vite
    </div>
  )
}

export default App
