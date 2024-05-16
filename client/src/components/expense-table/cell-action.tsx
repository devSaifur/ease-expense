import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { api, getExpensesQueryOptions } from '@/lib/api'
import { DialogClose } from '@radix-ui/react-dialog'
import {
  DotsHorizontalIcon,
  Pencil2Icon,
  TrashIcon,
} from '@radix-ui/react-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export default function CellAction({ id }: { id: string }) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

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

  function onSubmit(expenseId: string) {
    deleteExpense(expenseId)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <div className="flex w-full justify-between">
            <Dialog>
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
                    onClick={() => onSubmit(id)}
                    variant="destructive"
                    disabled={isDeleting}
                  >
                    Confirm delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div className="flex w-full justify-between">
            <span>Edit</span>
            <span>
              <Pencil2Icon className="size-4" />
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
