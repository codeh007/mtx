import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { postCreateMutation } from "mtmaiapi";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { TagsInput } from "mtxuilib/mt/inputs/TagsInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { toast } from "sonner";

import { Input } from "mtxuilib/ui/input";
import { useState } from "react";
import { z } from "zod";
import {
  CodeMirrorEditor,
  type EditorDocument,
  type OnChangeCallback,
  type OnSaveCallback,
} from "../../components/editor/codemirror/CodeMirrorEditor";
import { useTenant } from "../../hooks/useAuth";

export const Route = createFileRoute("/envs/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useSearch();
  const tenant = useTenant();
  const createEnv = useMutation({
    ...postCreateMutation(),
    onSuccess: (data) => {
      toast.success("操作成功");
    },
    onError: (error) => {
      console.log("失败", error);
    },
  });

  const [editorDocument, setEditorDocument] = useState<EditorDocument>({
    value: "hello",
    isBinary: false,
    filePath: "/",
  });

  const form = useZodForm({
    schema: z.any(),
  });

  const handleDocSave: OnSaveCallback = () => {
    console.log(editorDocument);
  };
  const onEditorChange: OnChangeCallback = (values) => {
    console.log(values.content);
  };
  return (
    <>
      <ZForm
        form={form}
        handleSubmit={(values) => {
          createEnv.mutate({
            path: {
              tenant: tenant!.metadata.id,
            },
            body: {
              ...values,
              siteId: siteId,
            },
          });
        }}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input {...form.register("title")} placeholder="title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>tags</FormLabel>
              <FormControl>
                <TagsInput {...field} placeholder="tags" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CodeMirrorEditor
          theme={"light"}
          // editable={!isStreaming && editorDocument !== undefined}
          // settings={editorSettings}
          doc={editorDocument}
          // autoFocusOnDocumentChange={isDesktop}
          // onScroll={onEditorScroll}
          onChange={onEditorChange}
          onSave={handleDocSave}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => <Input {...field} placeholder="slug" />}
        />
      </ZForm>
    </>
  );
}
