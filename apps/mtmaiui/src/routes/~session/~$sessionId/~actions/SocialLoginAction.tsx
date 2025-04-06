'use client'
import { AgentEventType } from "mtmaiapi";
import { zSocialLoginInput } from "mtmaiapi/gomtmapi/zod.gen";
import { useZodFormV2, ZForm, ZFormToolbar } from "mtxuilib/mt/form/ZodForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";


export const SocialLoginAction = () => {
    const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
    const form = useZodFormV2({
      schema: zSocialLoginInput,
      toastValidateError:true,
      defaultValues:{
        type: AgentEventType.SOCIAL_LOGIN_INPUT,
      },
      handleSubmit: (values) => {
        console.log("values", values);
        handleHumanInput({
          content: "",
          type: AgentEventType.AGENT_USER_INPUT,
          input: {
            ...values,
          },
        })
      },
    });
    return (
      <div className="px-2 space-y-2">
        <h1>SocialLoginAction</h1>
        <ZForm {...form} className="space-y-2">
        <input type="hidden"  {...form.form.register("type")} />
        <FormField
            control={form.form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </ZForm>
        <ZFormToolbar form={form.form} />
      </div>
    );
  };
  
  