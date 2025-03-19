import { useMutation } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { comsUpsertMutation } from "mtmaiapi";
import { zMtComponent } from "mtmaiapi/gomtmapi/zod.gen";
import { generateUUID } from "mtxuilib/lib/utils";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { toast } from "sonner";
import { DashHeaders } from "../../../components/DashHeaders";
import { useTenantId } from "../../../hooks/useAuth";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { ComTypeInput } from "../components/com_type_select";

export const Route = createLazyFileRoute("/coms/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const upsertCom = useMutation({
    ...comsUpsertMutation(),
    onSuccess: () => {
      toast.success("创建成功");
    },
  });
  const form = useZodForm({
    schema: zMtComponent,
    defaultValues: {
      type: "RoundRobinGroupChat",
      component: {},
    },
  });
  return (
    <RootAppWrapper secondSidebar={<NavComs />}>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>新建组件</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DashHeaders>
      <div className="flex flex-col h-full w-full px-2">
        <ZForm
          form={form}
          handleSubmit={(values) => {
            console.log(values);
            upsertCom.mutate({
              path: {
                tenant: tid,
                com: generateUUID(),
              },
              body: {
                ...values,
              },
            });
          }}
          className="space-y-2"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>类型</FormLabel>
                <FormControl>
                  {/* <Input {...field} /> */}
                  <ComTypeInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名称</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>描述</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="描述" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Outlet />
          <EditFormToolbar form={form} />
          {form.formState.errors && (
            <div className="text-red-500">
              {JSON.stringify(form.formState.errors, null, 2)}
            </div>
          )}
        </ZForm>
      </div>
    </RootAppWrapper>
  );
}
