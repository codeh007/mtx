import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { instagramLoginMutation } from "mtmaiapi";
import { zIgLogin } from "mtmaiapi/gomtmapi/zod.gen";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useTenantId } from "../../hooks/useAuth";

export const Route = createLazyFileRoute("/instagram/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  // const query1 = useQuery({
  //   ...instagramTestGetOptions(),
  //   // queryKey: ["instagramTestGet", tid],
  // })

  const igLoginMutation = useMutation({
    ...instagramLoginMutation(),
  });
  const form = useZodForm({
    schema: zIgLogin,
  });
  const handleSubmit = (data: any) => {
    igLoginMutation.mutate({
      body: data,
    });
  };

  return (
    <>
      <ZForm form={form} handleSubmit={handleSubmit}>
        <h1>登录</h1>
        <FormField
          control={form.control}
          name="twofa_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>twofa_code</FormLabel>
              <FormControl>
                <Input placeholder="twofa_code" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
      </ZForm>
      <EditFormToolbar form={form} />
    </>
  );
}
