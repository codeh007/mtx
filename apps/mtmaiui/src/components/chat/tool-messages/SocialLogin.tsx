import { AgentEventType } from "mtmaiapi";
import {
  useZodFormV2,
  ZForm,
  ZFormToolbar,
} from "mtxuilib/mt/form/ZodForm.jsx";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "mtxuilib/ui/form.jsx";
import { Input } from "mtxuilib/ui/input.jsx";

export const SocialLoginView = ({ msg }: { msg: any }) => {
  const form = useZodFormV2({
    schema: zSocialLoginInput,
    toastValidateError: true,
    defaultValues: {
      type: AgentEventType.SOCIAL_LOGIN_INPUT,
      username: "saibichquyenll2015",
      password: "qSJPn07c7",
      otp_key: "MCF3M4XZHTFWKYXUGV4CQX3LFXMKMWFP",
    },
    handleSubmit: (values) => {
      console.log("values", values);
      handleHumanInput({
        content: "",
        type: AgentEventType.AGENT_USER_INPUT,
        input: {
          ...values,
        },
      });
    },
  });

  return (
    <div className="rounded-md bg-yellow-100 p-1">
      <h1>social login view</h1>
      <pre className="text-xs bg-yellow-100 p-1">
        {JSON.stringify(msg, null, 2)}
      </pre>
      <ZForm {...form} className="space-y-2">
        <input type="hidden" {...form.form.register("type")} />
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
        <FormField
          control={form.form.control}
          name="otp_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>otp_key</FormLabel>
              <FormControl>
                <Input {...field} placeholder="otp_key" />
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
