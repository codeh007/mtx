"use client";

import { useToast as useToastUI } from "mtxuilib/ui/use-toast";

export const useToast = () => {
	const { toast } = useToastUI();
	return toast;
};
