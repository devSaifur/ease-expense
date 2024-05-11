'use client'

import CellAction from './cell-action'
import { BoxIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Expense = {
  id: string
  title: string
  amount: number
  createdAt: string
}

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: 'id',
    header: 'Task',
    cell: () => {
      return (
        <div>
          <BoxIcon />
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString()
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
    header: '',
    cell: ({ row }) => {
      return <CellAction id={row.original.id} />
    },
  },
]
