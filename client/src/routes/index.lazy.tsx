import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: () => <div className="mt-20 flex justify-center">Hello /!</div>,
})
