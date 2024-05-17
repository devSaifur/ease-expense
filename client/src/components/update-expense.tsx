import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { api, getExpensesQueryOptions } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  TExpenseUpdateSchema,
  expenseUpdateSchema,
} from '@server/lib/validators'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function UpdateExpense() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<TExpenseUpdateSchema>({
    resolver: zodResolver(expenseUpdateSchema),
    defaultValues: {
      title: '',
      amount: 0,
      date: new Date(),
    },
  })

  const { mutate: updateExpense, isPending } = useMutation({
    mutationFn: async (values: TExpenseUpdateSchema) => {
      const res = await api.expenses.$patch({ json: values })
      if (!res.ok) {
        throw new Error('Failed to update expense')
      }
      const { expense } = await res.json()
      return expense
    },
    onSuccess: async (updatedExpense) => {
      toast.success('Expense created successfully')
      setOpen(false)
      form.reset()
      queryClient.setQueryData(getExpensesQueryOptions.queryKey, (oldData) => {
        if (!oldData) return [updatedExpense]
        return [updatedExpense, ...oldData]
      })
    },
    onError: () => {
      toast.error('Failed to create expense')
    },
  })

  function onSubmit(values: TExpenseUpdateSchema) {
    updateExpense(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Add a new expense to your account
          </DialogDescription>
        </DialogHeader>

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
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
