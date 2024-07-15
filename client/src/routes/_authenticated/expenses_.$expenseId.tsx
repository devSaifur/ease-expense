import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api, getExpensesQueryOptions } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { TExpenseSchema, expenseSchema } from '@server/lib/validators'

export const Route = createFileRoute('/_authenticated/expenses/$expenseId')({
  component: () => <ExpensesPage />,
  loader: async ({ params }) => {
    const res = await api.expenses[':id'].$get({
      param: { id: params.expenseId },
    })
    if (!res.ok) {
      throw notFound()
    }
    const expense = await res.json()
    return expense
  },
})

function ExpensesPage() {
  const queryClient = useQueryClient()
  const { id, amount, date, accountId, categoryId } = Route.useLoaderData()
  const router = useRouter()

  const { mutate: updateExpense, isPending: isUpdating } = useMutation({
    mutationFn: async (values: TExpenseSchema) => {
      const res = await api.expenses.$patch({ json: values })
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      const expense = await res.json()
      return expense
    },
    onSuccess: async (updatedExpense) => {
      toast.success('Expense updated successfully')
      queryClient.setQueryData(getExpensesQueryOptions.queryKey, (oldData) => {
        if (!oldData) return [updatedExpense]

        const expenses = oldData.filter((e) => e.id !== updatedExpense.id)
        return [updatedExpense, ...expenses]
      })
      router.invalidate()
      router.navigate({ to: '/expenses' })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useForm<TExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      accountId,
      id,
      amount,
      date: new Date(date),
    },
  })

  function onSubmit(values: TExpenseSchema) {
    updateExpense(values)
  }

  return (
    <div className="mx-auto mt-12 max-w-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Amount"
                    onFocus={(e) => e.target.select()}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    defaultMonth={field.value}
                    className="flex justify-center"
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isUpdating}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}
