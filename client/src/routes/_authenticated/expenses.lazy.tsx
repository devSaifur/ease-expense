import AddExpense from '@/components/add-expense'
import ExpenseTable from '@/components/expense-table'
import { columns } from '@/components/expense-table/columns'
import { getExpensesQueryOptions } from '@/lib/api'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

function Expenses() {
  const { data: expenses, isPending } = useQuery(getExpensesQueryOptions)

  if (isPending) {
    return (
      <div className="flex items-center justify-center text-center">
        <ReloadIcon className="mr-2 size-6 animate-spin" /> Loading...
      </div>
    )
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col">
      <div className="ml-auto py-6">
        <AddExpense />
      </div>

      {!expenses?.length ? (
        <div className="flex items-center justify-center text-center">
          <p>No expenses found</p>
        </div>
      ) : (
        <ExpenseTable data={expenses} columns={columns} />
      )}
    </main>
  )
}
