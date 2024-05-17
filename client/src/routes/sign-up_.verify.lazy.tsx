import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { TOtpSchema, otpSchema } from '@server/lib/validators'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createLazyFileRoute('/sign-up/verify')({
  component: Verify,
})

function Verify() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate: verify, isPending } = useMutation({
    mutationFn: async (data: TOtpSchema) =>
      await api.auth.register.verify.$post({ json: data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      router.navigate({ to: '/' })
      toast.success('Email verified successfully')
    },
    onError: () => {
      toast.error('Failed to verify OTP')
    },
  })

  const form = useForm<TOtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  })

  function onSubmit(data: TOtpSchema) {
    verify(data)
  }

  return (
    <div className="mx-auto max-w-md pt-16">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time verification code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time verification code sent to your
                  email.
                </FormDescription>
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
