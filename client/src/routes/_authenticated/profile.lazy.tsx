import { userQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/profile')({
  component: Profile,
})

function Profile() {
  const { data: user, isPending, error } = useQuery(userQueryOptions)

  if (error) {
    return <p>{error.message}</p>
  }

  return (
    <div className="flex justify-center pt-14">
      {isPending ? (
        <p>Loading...</p>
      ) : (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      )}
    </div>
  )
}
