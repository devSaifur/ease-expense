import { Button } from '@/components/ui/button'
import { api, userQueryOptions } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createLazyFileRoute('/_authenticated/profile')({
  component: Profile,
})

function Profile() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: user, isPending } = useQuery(userQueryOptions)

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      const res = await api.auth.logout.$post()
      if (!res.ok) {
        throw new Error('Failed to logout')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.navigate({ to: '/sign-in' })
      toast.success('Logged out successfully')
    },
    onError: () => {
      toast.error('Something went wrong, Failed to logout')
    },
  })

  return (
    <div className="mx-auto flex max-w-lg flex-col justify-center pt-14">
      <Button
        onClick={() => logout()}
        disabled={isLoggingOut}
        className="ml-auto"
        variant="destructive"
      >
        Logout
      </Button>
      <div>
        {isPending ? (
          <p>Loading...</p>
        ) : (
          <pre>{JSON.stringify(user, null, 2)}</pre>
        )}
      </div>
    </div>
  )
}
