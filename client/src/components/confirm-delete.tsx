import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { api, getExpensesQueryOptions } from '@/lib/api'
import { DialogClose } from '@radix-ui/react-dialog'
import { TrashIcon } from '@radix-ui/react-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ConfirmDelete({ expenseId }: { expenseId: string }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

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
      setOpen(false)
      toast.success('Expense deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete expense')
    },
  })

  function onSubmit(expenseId: string) {
    deleteExpense(expenseId)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-0">
          Delete
          <TrashIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this expense?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => onSubmit(expenseId)}
            variant="destructive"
            disabled={isDeleting}
          >
            Confirm delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
