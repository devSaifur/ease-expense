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
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { TRegisterSchema, registerSchema } from '@server/lib/validators'

export const Route = createLazyFileRoute('/_auth/sign-up')({
  component: () => <RegisterPage />,
})

function RegisterPage() {
  const router = useRouter()
  const { mutate: register, isPending } = useMutation({
    mutationFn: async (values: TRegisterSchema) => {
      const res = await api.auth.register.$post({ form: values })
      if (!res.ok) {
        throw new Error('Failed to register')
      }
    },
    onSuccess: () => {
      router.navigate({ to: '/sign-up/verify', replace: true })
      toast.success(
        'An email has been sent to your email address with a verification code'
      )
    },
    onError: () => {
      toast.error('Failed to sign up user')
    },
  })

  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  function onSubmit(values: TRegisterSchema) {
    register(values)
  }

  return (
    <div className="mx-auto max-w-md pt-16">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
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
                  <Input placeholder="********" type="password" {...field} />
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
