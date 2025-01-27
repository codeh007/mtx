"use client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	platformAccountGetOptions,
	platformAccountUpdateMutation,
} from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
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
export const Route = createFileRoute("/platform-account/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const query = useSuspenseQuery({
		...platformAccountGetOptions({
			path: {
				platform_account: id,
			},
		}),
	});

	const updatePlatformAccountMutation = useMutation({
		...platformAccountUpdateMutation(),
	});
	const form = useZodForm({
		schema: z.object({
			username: z.string().optional(),
			password: z.string().optional(),
			email: z.string().optional(),
			type: z.string().optional(),
			platform: z.string().optional(),
			tags: z.array(z.string()).optional(),
		}),
		defaultValues: query.data,
	});
	return (
		<>
			<ZForm
				form={form}
				handleSubmit={(values) => {
					const convertedValues = {
						...values,
						tags: values.tags?.join(","),
					};
					updatePlatformAccountMutation.mutate({
						path: {
							platform_account: id,
						},
						body: convertedValues,
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
				<FormField
					control={form.control}
					name="platform"
					render={({ field }) => (
						<FormItem>
							<FormLabel>platform</FormLabel>
							<FormControl>
								<Input {...form.register("platform")} placeholder="platform" />
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
								<Input {...form.register("tags")} placeholder="tags" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DebugValue data={query.data} />
				<EditFormToolbar form={form} />
			</ZForm>
		</>
	);
}
