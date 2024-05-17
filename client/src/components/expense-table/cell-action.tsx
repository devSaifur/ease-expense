import ConfirmDelete from '../confirm-delete'
import { Button, buttonVariants } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Expense } from './columns'
import { cn } from '@/lib/utils'
import { DotsHorizontalIcon, Pencil2Icon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'

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
        <DropdownMenuItem>
          <div className="flex w-full justify-between">
            <Link
              to={`/expenses/${expense.id}`}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'w-full justify-between p-0'
              )}
            >
              Edit
              <Pencil2Icon className="size-4" />
            </Link>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
