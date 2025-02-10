import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { agentRunMutation, FlowNames } from 'mtmaiapi'
import { EditFormToolbar } from 'mtxuilib/mt/form/EditFormToolbar'
import { useZodForm, ZForm } from 'mtxuilib/mt/form/ZodForm'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'mtxuilib/ui/form'
import { Input } from 'mtxuilib/ui/input'
import { z } from 'zod'
import { useTenant } from '../../hooks/useAuth'

export const Route = createLazyFileRoute('/trigger/assisant')({
  component: RouteComponent,
})

function RouteComponent() {
  const tenant = useTenant()
  const agentRun = useMutation({
    ...agentRunMutation(),
  })

  const formSchema = z.object({
    input: z.string().optional(),
  })

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      input: '',
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    agentRun.mutate({
      path: {
        tenant: tenant!.metadata.id,
        // workflow: workflow.metadata.id,
      },
      body: {
        name: FlowNames.ASSISANT,
        params: {
          input: values.input,
        },
      },
    })
  }
  return (
    <>
      <h1>assisant</h1>
      <ZForm className="" handleSubmit={handleSubmit} form={form}>
        <FormField
          control={form.control}
          name="input"
          render={({ field }) => (
            <FormItem>
              <FormLabel>主题</FormLabel>
              <FormControl>
                <Input placeholder="输入" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
      </ZForm>
      <EditFormToolbar form={form} />
    </>
  )
}
