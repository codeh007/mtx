"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTenantId } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import {
	postDeleteMutation,
	postGetOptions,
} from "mtmaiapi/gomtmapi/@tanstack/react-query.gen";
import type { ApiErrors } from "mtmaiapi/gomtmapi/types.gen";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostPage() {
	const router = useRouter();
	const params = useParams();
	const { toast } = useToast();
	const tid = useTenantId();
	const [errors, setErrors] = useState<ApiErrors | null>(null);
	const postId = params.id as string;

	const { data: post, isLoading } = useQuery({
		...postGetOptions({
			path: {
				tenant: tid,
				post: postId,
			},
		}),
		enabled: !!tid && !!postId,
	});

	const deletePostMutation = useMutation({
		...postDeleteMutation({
			path: {
				tenant: tid,
				post: postId,
			},
		}),
		onError: setErrors,
		onSuccess: () => {
			toast({
				title: "文章删除成功",
				description: "已成功删除文章",
			});
			router.push("/dash/post");
		},
	});

	function handleDelete() {
		deletePostMutation.mutate({});
	}

	if (isLoading) {
		return <div className="p-6">加载中...</div>;
	}

	if (!post) {
		return <div className="p-6">文章不存在</div>;
	}

	return (
		<div className="p-6 max-w-md mx-auto">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center text-red-600">
						<AlertCircle className="mr-2" />
						确认删除
					</CardTitle>
					<CardDescription>
						您确定要删除以下文章吗？此操作无法撤销。
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div>
							<span className="font-semibold">标题：</span>
							{post.title}
						</div>
						<div>
							<span className="font-semibold">创建时间：</span>
							{new Date(post.metadata.created_at).toLocaleString()}
						</div>
					</div>

					{errors?.errors?.map((err) => (
						<div key={err.field} className="mt-4 text-sm text-red-500">
							{err.description}
						</div>
					))}
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" onClick={() => router.push("/dash/post")}>
						取消
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={deletePostMutation.isPending}
					>
						{deletePostMutation.isPending ? "删除中..." : "确认删除"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
