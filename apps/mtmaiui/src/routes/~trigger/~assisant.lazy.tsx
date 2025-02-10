"use client";
import { useMutation } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames, agentRunMutation } from "mtmaiapi";
import { zAgentRunInput } from "mtmaiapi/gomtmapi/zod.gen";
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
// import { z } from 'zod'
import { useTenant } from "../../hooks/useAuth";

export const Route = createLazyFileRoute("/trigger/assisant")({
	component: RouteComponent,
});

function RouteComponent() {
	const tenant = useTenant();
	const agentRun = useMutation({
		...agentRunMutation(),
	});

	const form = useZodForm({
		schema: zAgentRunInput,
		defaultValues: {
			// input: '',
		},
	});

	const handleSubmit = (values: z.infer<typeof zAgentRunInput>) => {
		agentRun.mutate({
			path: {
				tenant: tenant!.metadata.id,
				// workflow: workflow.metadata.id,
			},
			body: {
				name: FlowNames.ASSISANT,
				params: {
					// input: values.input,
				},
			},
		});
	};
	return (
		<div className="flex flex-col gap-4">
			<h1>assisant</h1>
			<ZForm className="" handleSubmit={handleSubmit} form={form}>
				<FormField
					control={form.control}
					name="params.messages"
					render={({ field }) => (
						<FormItem>
							<FormLabel>主题</FormLabel>
							<FormControl>
								<Input placeholder="输入" {...field} />
							</FormControl>
							<FormDescription>messages</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</ZForm>
			<EditFormToolbar form={form} />
		</div>
	);
}
