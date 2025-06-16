"use client";

import type { ApiErrors } from "mtmaiapi/gomtmapi/types.gen";
import { useToast } from "mtxuilib/ui/use-toast";

export const useErrors = () => {
	const { toast } = useToast();
	return (error: ApiErrors) => {
		if (error.errors) {
			const fullMessage = error.errors
				?.map((err) => err.description)
				.join("\n");
			toast({
				title: "注册失败",
				description: fullMessage,
				variant: "destructive",
			});
		}
	};
};
