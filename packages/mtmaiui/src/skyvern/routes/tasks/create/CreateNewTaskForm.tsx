"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon, PlayIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import fetchToCurl from "fetch-to-curl";

import { AutoResizingTextarea } from "mtxuilib/components/AutoResizingTextarea";
import { copyText } from "mtxuilib/lib/utils";
import { Button } from "mtxuilib/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Separator } from "mtxuilib/ui/separator";
import { ToastAction } from "mtxuilib/ui/toast";
import { useToast } from "mtxuilib/ui/use-toast";
import Link from "next/link";
import { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useBasePath } from "../../../../hooks/useBasePath";
import type { CreateTaskRequest } from "../../../api/types";
import { CodeEditor } from "../../workflows/components/CodeEditor";
import { MAX_STEPS_DEFAULT } from "../constants";
import { TaskFormSection } from "./TaskFormSection";
import {
  type CreateNewTaskFormValues,
  createNewTaskFormSchema,
} from "./taskFormTypes";

type Props = {
  initialValues: CreateNewTaskFormValues;
};

function transform<T>(value: T): T | null {
  return value === "" ? null : value;
}

function createTaskRequestObject(
  formValues: CreateNewTaskFormValues,
): CreateTaskRequest {
  let extractedInformationSchema = null;
  if (formValues.extractedInformationSchema) {
    try {
      extractedInformationSchema = JSON.parse(
        formValues.extractedInformationSchema,
      );
    } catch (e) {
      extractedInformationSchema = formValues.extractedInformationSchema;
    }
  }
  let errorCodeMapping = null;
  if (formValues.errorCodeMapping) {
    try {
      errorCodeMapping = JSON.parse(formValues.errorCodeMapping);
    } catch (e) {
      errorCodeMapping = formValues.errorCodeMapping;
    }
  }

  return {
    title: null,
    url: formValues.url,
    webhook_callback_url: transform(formValues.webhookCallbackUrl),
    navigation_goal: transform(formValues.navigationGoal),
    data_extraction_goal: transform(formValues.dataExtractionGoal),
    proxy_location: "RESIDENTIAL",
    navigation_payload: transform(formValues.navigationPayload),
    extracted_information_schema: extractedInformationSchema,
    totp_verification_url: transform(formValues.totpVerificationUrl),
    totp_identifier: transform(formValues.totpIdentifier),
    error_code_mapping: errorCodeMapping,
  };
}

type Section = "base" | "extraction" | "advanced";

export function CreateNewTaskForm({ initialValues }: Props) {
  // const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeSections, setActiveSections] = useState<Array<Section>>([
    "base",
  ]);
  const [showAdvancedBaseContent, setShowAdvancedBaseContent] = useState(false);

  const { data: organizations } = useQuery({
    // queryKey: ["organizations"],
    // queryFn: async () => {
    //   const client = await getClient(credentialGetter);
    //   return await client
    //     .get("/organizations")
    //     .then((response) => response.data.organizations);
    // },
    ...getOrganizationsOptions(),
  });

  const organization = organizations?.[0];

  const form = useForm<CreateNewTaskFormValues>({
    resolver: zodResolver(createNewTaskFormSchema),
    defaultValues: initialValues,
    values: {
      ...initialValues,
      maxStepsOverride: null,
    },
  });
  const basePath = useBasePath();

  const { errors } = useFormState({ control: form.control });

  // const mutation = useMutation({
  // 	mutationFn: async (formValues: CreateNewTaskFormValues) => {
  // 		const taskRequest = createTaskRequestObject(formValues);
  // 		const client = await getClient(credentialGetter);
  // 		const includeOverrideHeader =
  // 			formValues.maxStepsOverride !== null &&
  // 			formValues.maxStepsOverride !== MAX_STEPS_DEFAULT;
  // 		return client.post<
  // 			ReturnType<typeof createTaskRequestObject>,
  // 			{ data: { task_id: string } }
  // 		>("/tasks", taskRequest, {
  // 			...(includeOverrideHeader && {
  // 				headers: {
  // 					"x-max-steps-override": formValues.maxStepsOverride,
  // 				},
  // 			}),
  // 		});
  // 	},
  // 	onError: (error: AxiosError) => {
  // 		if (error.response?.status === 402) {
  // 			toast({
  // 				variant: "destructive",
  // 				title: "Failed to create task",
  // 				description:
  // 					"You don't have enough credits to run this task. Go to billing to see your credit balance.",
  // 				action: (
  // 					<ToastAction altText="Go to Billing">
  // 						<Button asChild>
  // 							<Link href="billing">Go to Billing</Link>
  // 						</Button>
  // 					</ToastAction>
  // 				),
  // 			});
  // 			return;
  // 		}
  // 		toast({
  // 			variant: "destructive",
  // 			title: "There was an error creating the task.",
  // 			description: error.message,
  // 		});
  // 	},
  // 	onSuccess: (response) => {
  // 		toast({
  // 			variant: "success",
  // 			title: "Task Created",
  // 			description: `${response.data.task_id} created successfully.`,
  // 			action: (
  // 				<ToastAction altText="View">
  // 					<Button asChild>
  // 						<Link href={`/tasks/${response.data.task_id}`}>View</Link>
  // 					</Button>
  // 				</ToastAction>
  // 			),
  // 		});
  // 		queryClient.invalidateQueries({
  // 			queryKey: ["tasks"],
  // 		});
  // 	},
  // });

  const mutation = useMutation({
    ...agentCreateAgentTaskMutation(),
    // onError: (error: AxiosError) => {
    // 	if (error.response?.status === 402) {
    // 		toast({
    // 			variant: "destructive",
    // 			title: "Failed to create task",
    // 			description:
    // 				"You don't have enough credits to run this task. Go to billing to see your credit balance.",
    // 			action: (
    // 				<ToastAction altText="Go to Billing">
    // 					<Button asChild>
    // 						<Link href="billing">Go to Billing</Link>
    // 					</Button>
    // 				</ToastAction>
    // 			),
    // 		});
    // 		return;
    // 	}
    // 	toast({
    // 		variant: "destructive",
    // 		title: "There was an error creating the task.",
    // 		description: error.message,
    // 	});
    // },

    onSuccess: (response) => {
      toast({
        variant: "success",
        title: "Task Created",
        description: `${response.task_id} created successfully.`,
        action: (
          <ToastAction altText="View">
            <Button asChild>
              <Link href={`${basePath}/tasks/${response.task_id}`}>View</Link>
            </Button>
          </ToastAction>
        ),
      });
      // queryClient.invalidateQueries({
      // 	queryKey: ["tasks"],
      // });
    },
  });

  function onSubmit(values: CreateNewTaskFormValues) {
    console.log("onSubmit", values);

    const taskRequest = createTaskRequestObject(values);
    mutation.mutate({
      body: {
        ...taskRequest,
      },
    });
  }

  function isActive(section: Section) {
    return activeSections.includes(section);
  }

  function toggleSection(section: Section) {
    if (isActive(section)) {
      setActiveSections(activeSections.filter((s) => s !== section));
    } else {
      setActiveSections([...activeSections, section]);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TaskFormSection
          index={1}
          title="基本设置"
          active={isActive("base")}
          onClick={() => {
            toggleSection("base");
          }}
          hasError={
            typeof errors.url !== "undefined" ||
            typeof errors.navigationGoal !== "undefined"
          }
        >
          {isActive("base") && (
            <div className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">URL</h1>
                            <h2 className="text-base text-slate-400">
                              The starting URL for the task
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input placeholder="https://" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="navigationGoal"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">目标</h1>
                            <h2 className="text-base text-slate-400">
                              你需要AI做什么？
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <AutoResizingTextarea
                              {...field}
                              placeholder="Tell Skyvern what to do."
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                {showAdvancedBaseContent ? (
                  <div className="border-t border-dashed pt-4">
                    <FormField
                      control={form.control}
                      name="navigationPayload"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex gap-16">
                            <FormLabel>
                              <div className="w-72">
                                <h1 className="text-lg">Navigation Payload</h1>
                                <h2 className="text-base text-slate-400">
                                  Specify important parameters, routes, or
                                  states
                                </h2>
                              </div>
                              <Button
                                className="mt-4"
                                type="button"
                                variant="tertiary"
                                onClick={() => {
                                  setShowAdvancedBaseContent(false);
                                }}
                                size="sm"
                              >
                                Hide Advanced Settings
                              </Button>
                            </FormLabel>
                            <div className="w-full">
                              <FormControl>
                                <CodeEditor
                                  {...field}
                                  language="json"
                                  minHeight="96px"
                                  maxHeight="500px"
                                  value={
                                    field.value === null ? "" : field.value
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <div>
                    <Button
                      type="button"
                      variant="tertiary"
                      onClick={() => {
                        setShowAdvancedBaseContent(true);
                      }}
                      size="sm"
                    >
                      Show Advanced Settings
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </TaskFormSection>
        <TaskFormSection
          index={2}
          title="内容提取"
          active={isActive("extraction")}
          onClick={() => {
            toggleSection("extraction");
          }}
          hasError={
            typeof errors.dataExtractionGoal !== "undefined" ||
            typeof errors.extractedInformationSchema !== "undefined"
          }
        >
          {isActive("extraction") && (
            <div className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="dataExtractionGoal"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Data Extraction Goal</h1>
                            <h2 className="text-base text-slate-400">
                              What outputs are you looking to get?
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <AutoResizingTextarea
                              {...field}
                              placeholder="What data do you need to extract?"
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="extractedInformationSchema"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Data Schema</h1>
                            <h2 className="text-base text-slate-400">
                              Specify the output format in JSON
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <CodeEditor
                              {...field}
                              language="json"
                              minHeight="96px"
                              maxHeight="500px"
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </TaskFormSection>
        <TaskFormSection
          index={3}
          title="高级设置"
          active={isActive("advanced")}
          onClick={() => {
            toggleSection("advanced");
          }}
          hasError={
            typeof errors.navigationPayload !== "undefined" ||
            typeof errors.maxStepsOverride !== "undefined" ||
            typeof errors.webhookCallbackUrl !== "undefined" ||
            typeof errors.errorCodeMapping !== "undefined"
          }
        >
          {isActive("advanced") && (
            <div className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="maxStepsOverride"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Max Steps Override</h1>
                            <h2 className="text-base text-slate-400">
                              Want to allow this task to execute more or less
                              steps than the default?
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={1}
                              value={field.value ?? ""}
                              placeholder={`Default: ${organization?.max_steps_per_run ?? MAX_STEPS_DEFAULT}`}
                              onChange={(event) => {
                                const value =
                                  event.target.value === ""
                                    ? null
                                    : Number(event.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="webhookCallbackUrl"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Webhook Callback URL</h1>
                            <h2 className="text-base text-slate-400">
                              The URL of a webhook endpoint to send the
                              extracted information
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://"
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="errorCodeMapping"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">Error Messages</h1>
                            <h2 className="text-base text-slate-400">
                              Specify any error outputs you would like to be
                              notified about
                            </h2>
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <CodeEditor
                              {...field}
                              language="json"
                              minHeight="96px"
                              maxHeight="500px"
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="totpVerificationUrl"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">2FA Verification URL</h1>
                            {/* biome-ignore lint/a11y/useHeadingContent: <explanation> */}
                            <h2 className="text-base text-slate-400" />
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Provide your 2FA endpoint"
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totpIdentifier"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-16">
                        <FormLabel>
                          <div className="w-72">
                            <h1 className="text-lg">2FA Identifier</h1>
                            {/* biome-ignore lint/a11y/useHeadingContent: <explanation> */}
                            <h2 className="text-base text-slate-400" />
                          </div>
                        </FormLabel>
                        <div className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Add an ID that links your TOTP to the task"
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </TaskFormSection>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              const curl = fetchToCurl({
                method: "POST",
                url: `${apiBaseUrl}/tasks`,
                body: createTaskRequestObject(form.getValues()),
                headers: {
                  "Content-Type": "application/json",
                  // "x-api-key": apiCredential ?? "<your-api-key>",
                },
              });
              copyText(curl).then(() => {
                toast({
                  title: "Copied cURL",
                  description: "cURL copied to clipboard",
                });
              });
            }}
          >
            <CopyIcon className="mr-2 h-4 w-4" />
            cURL
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            <PlayIcon className="mr-2 h-4 w-4" />
            Run
          </Button>
        </div>
      </form>
    </Form>
  );
}