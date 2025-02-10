import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { ZForm, useZodForm } from 'mtxuilib/mt/form/ZodForm'
import { Input } from 'mtxuilib/ui/input'

import { agentRunMutation, FlowNames } from 'mtmaiapi'
import { EditFormToolbar } from 'mtxuilib/mt/form/EditFormToolbar'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'mtxuilib/ui/form'
import { useState } from 'react'
import { z } from 'zod'
import { useApiError } from '../../hooks/useApi'
import { useTenant } from '../../hooks/useAuth'

export const Route = createLazyFileRoute('/trigger/browser')({
  component: RouteComponent,
})

function RouteComponent() {
  const tenant = useTenant()
  const [errors, setErrors] = useState<string[]>([])

  const { handleApiError } = useApiError({
    setErrors,
  })
  const agentRun = useMutation({
    ...agentRunMutation(),
  })

  const formSchema = z.object({
    input: z.string().optional(),
    // addlMeta: z.string().optional(),
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
        name: FlowNames.BROWSER,
        params: {
          input: values.input,
        },
      },
    })
  }

  return (
    <>
      <h1>FlowBrowser</h1>
      <ZForm className="" handleSubmit={handleSubmit} form={form}>
        <FormField
          control={form.control}
          name="input"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
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

//'{\n  "current_state": {\n    "evaluation_previous_goal": "Unknown - No previous actions to evaluate.",\n    "memory": "Started with a blank page",\n    "next_goal": "Navigate to the Wikipedia page about the Internet"\n  },\n  "action": [\n    {\n      "go_to_url": {\n        "url": "https://en.wikipedia.org/wiki/Internet"\n      }\n    }\n  ]\n}'
