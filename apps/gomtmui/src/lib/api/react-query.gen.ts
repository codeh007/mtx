// 这个文件是为了解决构建错误而创建的临时文件
// 实际应该使用 mtmaiapi 包中的函数

export const pAccountListOptions = (options: any) => {
	return {
		queryKey: ["pAccount", "list", options?.tenantId],
		queryFn: async () => {
			// 这里应该是实际的 API 调用
			return {
				rows: [],
				pagination: {
					current_page: 1,
					next_page: null,
					num_pages: 1,
				},
			};
		},
		enabled: !!options?.tenantId,
	};
};

export const pAccountGetOptions = (options: any) => {
	return {
		queryKey: ["pAccount", "get", options?.tenantId, options?.accountId],
		queryFn: async () => {
			// 这里应该是实际的 API 调用
			return {
				metadata: {
					id: options?.accountId || "",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				username: "",
				password: "",
				email: "",
				platform: "",
				enabled: true,
				name: "",
				description: "",
				type: "",
			};
		},
		enabled: !!options?.tenantId && !!options?.accountId,
	};
};
