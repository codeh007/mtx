"use client";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { platformAccountCreateMutation } from "mtmaiapi";
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
import { z } from "zod";

export const Route = createFileRoute("/platform-account/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const createPlatformAccountMutation = useMutation({
		...platformAccountCreateMutation(),
	});
	const form = useZodForm({
		schema: z.any(),
		// defaultValues: post,
	});
	return (
		<>
			<ZForm
				form={form}
				handleSubmit={(values) => {
					createPlatformAccountMutation.mutate({
						// path: {
						//   tenant: tenant!.metadata.id,
						// },
						body: {
							...values,
							// siteId: siteId,
						},
					});
				}}
				className="space-y-2"
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>User name</FormLabel>
							<FormControl>
								<Input {...form.register("username")} placeholder="username" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input {...form.register("password")} placeholder="password" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>type</FormLabel>
							<FormControl>
								<Input {...form.register("type")} placeholder="type" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<EditFormToolbar form={form} />
			</ZForm>
		</>
	);
}
