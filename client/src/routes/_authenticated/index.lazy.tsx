import { Button } from '@/components/ui/button'
import type { ChartConfig } from '@/components/ui/chart'
import { ChartContainer } from '@/components/ui/chart'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { PlusIcon } from '@radix-ui/react-icons'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Bar, BarChart } from 'recharts'

export const Route = createLazyFileRoute('/_authenticated/')({
  component: HomePage,
})

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
} satisfies ChartConfig

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const IncomeCategories = ['Salary', 'Gifts', 'Refunds', 'Other'] as const
const ExpenseCategories = [
  'Housing',
  'Shopping',
  'Food & Drinks',
  'Bills',
  'Transportation',
  'Vehicle',
  'Lifestyle',
] as const

function HomePage() {
  return (
    <div className="mx-auto mt-20 flex max-w-lg flex-col">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>

      <div className="mx-auto mt-10">
        <Drawer>
          <DrawerTrigger className="rounded-md bg-foreground" asChild>
            <Button variant="outline" size="icon">
              <PlusIcon className="size-10 font-bold text-background" />
            </Button>
          </DrawerTrigger>

          <DrawerContent>
            <div className="mx-auto h-[50dvh] min-w-96 py-6">
              <DrawerTitle>Manage Money</DrawerTitle>
              <DrawerDescription>
                Manage your accounts, transfer money
              </DrawerDescription>

              <Tabs defaultValue="expense">
                <TabsList className="mx-auto flex">
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expense">Expense</TabsTrigger>
                  <TabsTrigger value="transfer">Transfer</TabsTrigger>
                </TabsList>

                <Accounts />

                <TabsContent value="income">
                  <Categories categories={IncomeCategories} />
                </TabsContent>

                <TabsContent value="expense">
                  <Categories categories={ExpenseCategories} />
                </TabsContent>

                <TabsContent value="transfer">
                  Transfer money to another account.
                </TabsContent>
              </Tabs>

              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}

function Accounts() {
  const [activeAccount, setActiveAccount] = useState('cash')

  const accounts = ['cash', 'bkash', 'rocket'] as const

  const handleToggle = (account: string) => {
    setActiveAccount(account)
  }

  return (
    <div className="mt-10 flex justify-center gap-x-2 rounded-md bg-secondary px-4 py-2">
      {accounts.map((account) => (
        <div
          key={account}
          onClick={() => handleToggle(account)}
          className={cn(
            'rounded-md px-3 py-2',
            activeAccount === account && 'bg-background'
          )}
        >
          {account.charAt(0).toUpperCase() + account.slice(1)}
        </div>
      ))}
    </div>
  )
}

function Categories<T extends string>({
  categories,
}: {
  categories: Readonly<T[]>
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const handleToggle = (category: string) => {
    setActiveCategory(category)
  }

  return (
    <div className="mt-10 flex justify-center gap-x-2 rounded-md bg-secondary px-4 py-2">
      {categories.map((category) => (
        <div
          key={category}
          onClick={() => handleToggle(category)}
          className={cn(
            'rounded-md px-3 py-2',
            activeCategory === category && 'bg-background'
          )}
        >
          {category}
        </div>
      ))}
    </div>
  )
}
