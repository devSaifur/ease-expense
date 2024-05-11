import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { api, getExpensesQueryOptions } from '@/lib/api'
import {
  DotsHorizontalIcon,
  Pencil2Icon,
  TrashIcon,
} from '@radix-ui/react-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function CellAction({ id }: { id: string }) {
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
      toast.success('Expense deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete expense')
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => deleteExpense(id)}
          disabled={isDeleting}
        >
          <div className="flex w-full justify-between">
            <span>Delete</span>
            <span>
              <TrashIcon className="size-4" />
            </span>
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
