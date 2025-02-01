import { useQuery } from "@tanstack/react-query";
import type { FormProps } from "antd";
import { Form, Input, Select, Spin, message } from "antd";
import { TriangleAlertIcon } from "lucide-react";
import { teamListOptions } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "mtxuilib/ui/dialog";
import type React from "react";
import { useEffect } from "react";
import { CustomLink } from "../../../../components/CustomLink";
import { useTenant, useUser } from "../../../../hooks/useAuth";
import type { SessionEditorProps } from "./types";

type FieldType = {
	name: string;
	teamId?: string;
};

export const SessionEditor: React.FC<SessionEditorProps> = ({
	session,
	onSave,
	onCancel,
	isOpen,
}) => {
	const [form] = Form.useForm();
	// const [teams, setTeams] = useState<Team[]>([]);
	// const [loading, setLoading] = useState(false);
	// const { user } = useContext(appContext);
	const [messageApi, contextHolder] = message.useMessage();

	const tenant = useTenant();
	const user = useUser();

	// Fetch teams when modal opens
	// useEffect(() => {
	//   const fetchTeams = async () => {
	//     if (isOpen) {
	//       try {
	//         setLoading(true);
	//         const userId = user?.email || "";
	//         const teamsData = await teamAPI.listTeams(userId);
	//         setTeams(teamsData);
	//       } catch (error) {
	//         messageApi.error("Error loading teams");
	//         console.error("Error loading teams:", error);
	//       } finally {
	//         setLoading(false);
	//       }
	//     }
	//   };
	//   fetchTeams();
	// }, [isOpen, user?.email]);

	const teamQuery = useQuery({
		...teamListOptions({
			path: {
				tenant: tenant!.metadata.id,
			},
		}),
	});

	// Set form values when modal opens or session changes
	useEffect(() => {
		if (isOpen) {
			form.setFieldsValue({
				name: session?.name || "",
				team_id: session?.team_id || undefined,
			});
		} else {
			form.resetFields();
		}
	}, [form, session, isOpen]);

	const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
		try {
			await onSave({
				...values,
				id: session?.id,
			});
			messageApi.success(
				`Session ${session ? "updated" : "created"} successfully`,
			);
		} catch (error) {
			if (error instanceof Error) {
				messageApi.error(error.message);
			}
		}
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
		errorInfo,
	) => {
		messageApi.error("Please check the form for errors");
		console.error("Form validation failed:", errorInfo);
	};

	const hasNoTeams = !teamQuery.isLoading && teamQuery.data?.rows?.length === 0;

	return (
		<Dialog
			// title={session ? "Edit Session" : "Create Session"}
			open={isOpen}
			onOpenChange={onCancel}
			// footer={null}
			// className="text-primary"
			// forceRender
		>
			<DialogTrigger asChild>
				<Button>Create Session</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Session</DialogTitle>
				</DialogHeader>
				{contextHolder}
				<Form
					form={form}
					name="session-form"
					layout="vertical"
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item<FieldType>
						label="Session Name"
						name="name"
						rules={[
							{ required: true, message: "Please enter a session name" },
							{
								max: 100,
								message: "Session name cannot exceed 100 characters",
							},
						]}
					>
						<Input />
					</Form.Item>

					<div className="space-y-2   w-full">
						<Form.Item<FieldType>
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
						</Form.Item>
					</div>

					<div className="text-sm ">
						<CustomLink to="/ag/team">view all teams</CustomLink>
					</div>

					{hasNoTeams && (
						<div className="flex border p-1 rounded -mt-2 mb-4 items-center gap-1.5 text-sm text-yellow-600">
							<TriangleAlertIcon className="h-4 w-4" />
							<span>No teams found. Please create a team first.</span>
						</div>
					)}

					<Form.Item className="flex justify-end mb-0">
						<div className="flex gap-2">
							<Button variant="outline" onClick={onCancel}>
								Cancel
							</Button>
							<Button type="submit" disabled={hasNoTeams}>
								{session ? "Update" : "Create"}
							</Button>
						</div>
					</Form.Item>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
