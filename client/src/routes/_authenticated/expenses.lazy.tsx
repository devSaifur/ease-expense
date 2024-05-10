import AddExpense from '@/components/add-expense'
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
import { api, getExpensesQueryOptions } from '@/lib/api'
import { Cross1Icon, ReloadIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createLazyFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

function Expenses() {
  const queryClient = useQueryClient()

  const { data: expenses, isPending } = useQuery(getExpensesQueryOptions)

  const { mutate: deleteExpense, isPending: isDeleting } = useMutation({
    mutationKey: ['expenses'],
    mutationFn: async (id: string) => {
      const res = await api.expenses[':id'].$delete({ param: { id } })
      if (!res.ok) {
        throw new Error('Failed to fetch expenses')
      }
      const { deletedExpense } = await res.json()
      return deletedExpense
    },
    onSuccess: (deletedExpense) => {
      queryClient.setQueryData(getExpensesQueryOptions.queryKey, (oldData) => {
        if (!oldData) return
        return oldData.filter((e) => e.id !== deletedExpense.id)
      })
      toast.success('Expense deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete expense')
    },
  })

  if (isPending || isDeleting) {
    return (
      <div className="flex items-center justify-center text-center">
        <ReloadIcon className="mr-2 size-6 animate-spin" /> Loading...
      </div>
    )
  }

  const totalExpense = expenses?.reduce((acc, e) => acc + e.amount, 0)

  return (
    <main className="mx-auto flex max-w-3xl flex-col">
      <div className="ml-auto py-6">
        <AddExpense />
      </div>

      <Table className="mx-auto">
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
                  <Cross1Icon className="size-4" />
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
