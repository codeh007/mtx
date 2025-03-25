import { useMutation } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { comsUpsertMutation } from "mtmaiapi";
import { zMtComponent } from "mtmaiapi/gomtmapi/zod.gen";
import { generateUUID } from "mtxuilib/lib/utils";
import { ZFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { toast } from "sonner";
import { useTenantId } from "../../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";
import { ComTypeInput } from "../../components/com_type_select";

export const Route = createLazyFileRoute("/coms/$comId/type")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();

  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const handleRun = () => {
    console.log(`run ${comId}`);
    handleHumanInput({
      content: `这是用于社交媒体(Instagram)的的自动化任务,具体的账号数据,可以通过工具调用获取到,我希望结合团队的能力,完成这个任务,
      具体的要求是:
      1: 先诊断账号是否可用,方法是调用 browser 工具尝试登录instagram,如果登录成功,则账号可用,如果登录失败,则账号不可用,
      2: 如果账号可用,则调用 browser 工具获取账号的详细信息,包括粉丝数,点赞数,评论数,发帖数,关注数,
      3: 主动搜索相关主题的小博主,并关注他们,注意不要关注大博主.
      `,
      componentId: comId,
    });
  };
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
    <>
      <div className="flex justify-end bg-slate-50 p-2">
        <Button onClick={handleRun}>运行</Button>
      </div>

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
          <ZFormToolbar form={form} />
          {form.formState.errors && (
            <div className="text-red-500">
              {JSON.stringify(form.formState.errors, null, 2)}
            </div>
          )}
        </ZForm>
      </div>
    </>
  );
}
