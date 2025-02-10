"use client";
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Input } from "mtxuilib/ui/input";

import { FlowNames, agentRunMutation } from "mtmaiapi";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "mtxuilib/ui/form";
import { z } from "zod";
import { useTenant } from "../../hooks/useAuth";

export const Route = createLazyFileRoute("/trigger/browser")({
	component: RouteComponent,
});

function RouteComponent() {
	const tenant = useTenant();
	const agentRun = useMutation({
		...agentRunMutation(),
	});

	const formSchema = z.object({
		input: z.string().optional(),
	});

	const form = useZodForm({
		schema: formSchema,
		defaultValues: {
			input: "",
		},
	});

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		agentRun.mutate({
			path: {
				tenant: tenant!.metadata.id,
			},
			body: {
				name: FlowNames.BROWSER,
				params: {
					input: values.input,
				},
			},
		});
	};

	return (
		<>
			<h1>FlowBrowser</h1>
			<ZForm className="" handleSubmit={handleSubmit} form={form}>
				<FormField
					control={form.control}
					name="input"
					render={({ field }) => (
						<FormItem>
							<FormLabel>标题</FormLabel>
							<FormControl>
								<Input placeholder="输入" {...field} />
							</FormControl>
							<FormDescription>
								输入要搜索的标题，例如：“如何使用React”
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</ZForm>
			<EditFormToolbar form={form} />
		</>
	);
}
