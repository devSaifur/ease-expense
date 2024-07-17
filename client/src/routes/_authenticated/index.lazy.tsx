import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/')({
  component: () => <HomePage />,
})

function HomePage() {
  return <div className="mt-20 flex justify-center">Hello /!</div>
}
