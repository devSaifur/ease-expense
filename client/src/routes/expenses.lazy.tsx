import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'
import { Cross1Icon, ReloadIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createLazyFileRoute('/expenses')({
  component: Expenses,
})

function Expenses() {
  const queryClient = useQueryClient()

  const { data: expenses, isPending } = useQuery({
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

  const { mutate: deleteExpense, isPending: isDeleting } = useMutation({
    mutationKey: ['expenses'],
    mutationFn: async (id: string) => {
      const res = await api.expenses[':id{[0-9]+}'].$delete({ param: { id } })
      if (!res.ok) {
        throw new Error('Failed to fetch expenses')
      }
      const deletedExpense = await res.json()
      console.log('deleted', deletedExpense)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast.success('Expense deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete expense')
    },
  })

  if (isPending || isDeleting) {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <ReloadIcon className="mr-2 size-6 animate-spin" /> Loading...
      </div>
    )
  }

  const totalExpense = expenses?.reduce((acc, e) => acc + e.amount, 0)

  return (
    <main>
      <Table className="mx-auto max-w-4xl">
        <TableCaption>A list of your recent expenses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses?.map((e) => (
            <TableRow key={e.id}>
              <TableCell>
                <Button
                  onClick={() => deleteExpense(e.id.toString())}
                  variant="ghost"
                  size="sm"
                  className="p-0 text-red-500"
                >
                  <Cross1Icon className="size-5" />
                </Button>
              </TableCell>
              <TableCell>{e.title}</TableCell>
              <TableCell>{e.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>{totalExpense}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </main>
  )
}
