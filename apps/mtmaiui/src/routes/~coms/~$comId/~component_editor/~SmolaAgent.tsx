import { createFileRoute } from "@tanstack/react-router";
import { ZForm, ZFormToolbar, useZodForm } from "mtxuilib/mt/form/ZodForm";
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
import { z } from "zod";
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
    schema: z.any(),
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
        <ZFormToolbar form={form} />
      </ModelContent>
    </MtModal>
  );
}

export const SmolaAgentConfigFormFields = () => {
  const form = useFormContext();
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
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>label</FormLabel>
            <FormControl>
              <Input placeholder="label" {...field} />
            </FormControl>
            <FormDescription>label</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="config.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>name</FormLabel>
            <FormControl>
              <Input placeholder="name" {...field} />
            </FormControl>
            <FormDescription>name</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>description</FormLabel>
            <FormControl>
              <Input placeholder="description" {...field} />
            </FormControl>
            <FormDescription>description</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
