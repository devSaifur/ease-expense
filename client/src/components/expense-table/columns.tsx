import { Checkbox } from '../ui/checkbox'
import CellAction from './cell-action'
import { ColumnDef } from '@tanstack/react-table'

export type Expense = {
  id: string
  title: string
  amount: number
  date: string
}

export const columns: ColumnDef<Expense>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.original.date).toLocaleDateString()
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: (info) => {
      return `$${info.getValue() ?? 0}`
    },
  },
  {
    accessorKey: 'id',
    header: 'Actions',
    cell: ({ row }) => <CellAction id={row.original.id} />,
  },
]
