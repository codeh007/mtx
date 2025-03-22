import { createFileRoute } from "@tanstack/react-router";
import { zSmolaAgentComponent } from "mtmaiapi/gomtmapi/zod.gen";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import {
  ModelContent,
  ModelHeader,
  ModelTitle,
  MtModal,
} from "../../../../stores/model.store";
import { useTeamBuilderStore } from "../../../../stores/teamBuildStore";

export const Route = createFileRoute(
  "/coms/$comId/component_editor/SmolaAgent",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const selectedNode = useTeamBuilderStore((x) => x.selectedNode);

  const form = useZodForm({
    schema: zSmolaAgentComponent,
    defaultValues: {
      ...selectedNode?.data.component,
    },
  });

  const handleSubmit = (data: any) => {
    console.log("data", data);
  };

  return (
    <MtModal>
      <ModelContent>
        <ZForm form={form} handleSubmit={handleSubmit}>
          <ModelHeader>
            <ModelTitle>smola agent editor</ModelTitle>
          </ModelHeader>

          <SmolaAgentConfigFormFields />
        </ZForm>
        <EditFormToolbar form={form} />
      </ModelContent>
    </MtModal>
  );
}

export const SmolaAgentConfigFormFields = () => {
  const form = useFormContext<z.infer<typeof zSmolaAgentComponent>>();
  return (
    <>
      <FormField
        control={form.control}
        name="provider"
        render={({ field }) => (
          <FormItem>
            <FormLabel>provider</FormLabel>
            <FormControl>
              <Input placeholder="provider" {...field} />
            </FormControl>
            <FormDescription>provider</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
