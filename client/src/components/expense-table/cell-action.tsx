import ConfirmDelete from '../confirm-delete'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import UpdateExpense from '../update-expense'
import { Expense } from './columns'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

export default function CellAction({ expense }: { expense: Expense }) {
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
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <div className="flex w-full justify-between">
            <ConfirmDelete expenseId={expense.id} />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <div className="flex w-full justify-between">
            <UpdateExpense expense={expense} />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
