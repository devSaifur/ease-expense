import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { TLoginSchema, loginSchema } from '@server/lib/validators'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createLazyFileRoute('/sign-in')({
  component: SignIn,
})

export default function SignIn() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutate: login, isPending } = useMutation({
    mutationFn: async (values: TLoginSchema) => {
      const res = await api.auth.login.$post({ json: values })
      if (!res.ok) {
        throw new Error('Failed to login')
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      router.navigate({ to: '/' })
      toast.success('Logged in successfully')
    },
    onError: () => {
      toast.error('Something went wrong, Failed to login')
    },
  })

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: TLoginSchema) {
    login(values)
  }

  return (
    <div className="mx-auto max-w-md pt-16">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="******" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}
