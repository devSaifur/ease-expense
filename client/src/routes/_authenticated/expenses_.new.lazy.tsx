import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { TExpenseSchema, expenseSchema } from '@server/lib/validators'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createLazyFileRoute('/_authenticated/expenses/new')({
  component: NewExpense,
})

function NewExpense() {
  const router = useRouter()

  const { mutate: createExpense, isPending } = useMutation({
    mutationFn: async (values: TExpenseSchema) => {
      const res = await api.expenses.$post({ json: values })
      if (!res.ok) {
        throw new Error('Failed to create expense')
      }
      const createdExpense = await res.json()
      console.log('created', createdExpense)
    },
    onSuccess: () => {
      router.navigate({ to: '/expenses' })
      toast.success('Expense created successfully')
    },
    onError: () => {
      toast.error('Failed to create expense')
    },
  })

  const form = useForm<TExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      amount: 0,
    },
  })

  function onSubmit(values: TExpenseSchema) {
    createExpense(values)
  }

  return (
    <div className="mx-auto max-w-md pt-16">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
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
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}
