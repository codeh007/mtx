import { useMutation, useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { TriangleAlertIcon } from "lucide-react";
import {
  type Session,
  sessionCreateMutation,
  sessionUpdateMutation,
  teamListOptions,
} from "mtmaiapi";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "mtxuilib/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { z } from "zod";
import { CustomLink } from "../../components/CustomLink";
import { useTenant, useUser } from "../../hooks/useAuth";
import { TeamCombo } from "../~team/TeamCombo";

export interface SessionEditorProps {
  session?: Session;
  onCancel: () => void;
  isOpen: boolean;
}
export const SessionEditor = ({
  session,
  // onSave,
  onCancel,
  isOpen,
}: SessionEditorProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const form = useZodForm({
    schema: z.object({
      name: z.string().min(1, { message: "Name is required" }),
      teamId: z.string().optional(),
    }),
  });
  const tenant = useTenant();
  const user = useUser();

  const teamQuery = useQuery({
    ...teamListOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
    }),
  });

  // Set form values when modal opens or session changes
  // useEffect(() => {
  //   if (isOpen) {
  //     form.setFieldsValue({
  //       name: session?.name || "",
  //       team_id: session?.team_id || undefined,
  //     });
  //   } else {
  //     form.resetFields();
  //   }
  // }, [form, session, isOpen]);

  const updateSession = useMutation({
    ...sessionUpdateMutation(),
  });

  const createSession = useMutation({
    ...sessionCreateMutation(),
  });

  const handleSubmit = async (values) => {
    try {
      if (session) {
        await updateSession.mutateAsync({
          path: {
            tenant: tenant!.metadata.id,
            session: session!.metadata.id,
          },
          body: {
            ...values,
          },
        });
      } else {
        await createSession.mutateAsync({
          path: {
            tenant: tenant!.metadata.id,
          },
          body: {
            ...values,
          },
        });
      }
      messageApi.success(
        `Session ${session ? "updated" : "created"} successfully`,
      );
    } catch (error) {
      if (error instanceof Error) {
        messageApi.error(error.message);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    messageApi.error("Please check the form for errors");
    console.error("Form validation failed:", errorInfo);
  };

  const hasNoTeams = !teamQuery.isLoading && teamQuery.data?.rows?.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogTrigger asChild>
        <Button>Create Session</Button>
      </DialogTrigger>
      <DialogContent className="w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Session</DialogTitle>
        </DialogHeader>
        {contextHolder}
        <ZForm form={form} handleSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teamId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>teamId</FormLabel>
                <FormControl>
                  {/* <Input placeholder="teamId" {...field} /> */}
                  <TeamCombo {...field} />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2   w-full">
            {/* <Form.Item<FieldType>
              className="w-full"
              label="Team"
              name="teamId"
              rules={[{ required: true, message: "Please select a team" }]}
            >
              <Select
                placeholder="Select a team"
                loading={teamQuery.isLoading}
                disabled={teamQuery.isLoading || hasNoTeams}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={teamQuery.data?.rows?.map((team) => ({
                  value: team.metadata.id,
                  label: `${team.config.name} (${team.config.team_type})`,
                }))}
                notFoundContent={
                  teamQuery.isLoading ? <Spin size="small" /> : null
                }
              />
            </Form.Item> */}
          </div>

          <div className="text-sm ">
            <CustomLink to="../team">view all teams</CustomLink>
          </div>

          {hasNoTeams && (
            <div className="flex border p-1 rounded -mt-2 mb-4 items-center gap-1.5 text-sm text-yellow-600">
              <TriangleAlertIcon className="h-4 w-4" />
              <span>No teams found. Please create a team first.</span>
            </div>
          )}
          <EditFormToolbar form={form} />
        </ZForm>
      </DialogContent>
    </Dialog>
  );
};
