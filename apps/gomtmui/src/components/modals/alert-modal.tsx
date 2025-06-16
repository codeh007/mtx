"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
	title?: string;
	description?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	loading,
	title = "确认操作",
	description = "您确定要执行此操作吗？此操作无法撤销。",
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<Modal
			title={title}
			description={description}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="pt-6 space-x-2 flex items-center justify-end w-full">
				<Button disabled={loading} variant="outline" onClick={onClose}>
					取消
				</Button>
				<Button disabled={loading} variant="destructive" onClick={onConfirm}>
					{loading ? "处理中..." : "确认"}
				</Button>
			</div>
		</Modal>
	);
};
