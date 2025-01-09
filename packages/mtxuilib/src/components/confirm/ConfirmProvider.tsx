"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
} from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { ConfirmModal } from "./Confrom";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type ConfirmModalProps = {};

export interface ConfirmModalState extends ConfirmModalProps {
	open?: boolean;
	setOpen: (_open: boolean) => void;
	onConfirm?: (values: any) => void;
	onCancel?: () => void;
	setOnConfirm: (_onConfirm: (values: any) => void) => void;
	setOnCancel: (_onCancel: () => void) => void;

	options?: ConfirmModalOptions;
	setOptions: (_options: ConfirmModalOptions) => void;
	values?: any;
	setValues: (_values: any) => void;
}

export const createAppSlice: StateCreator<
	ConfirmModalState,
	[],
	[],
	ConfirmModalState
> = (set, get, init) => {
	return {
		open: false,
		...init,
		setOpen(_open) {
			set({ open: _open });
		},
		setOnConfirm: (onConfirm) => set({ onConfirm }),
		setOnCancel: (onCancel) => set({ onCancel }),
		setOptions: (options) => set({ options }),
		setValues: (values) => set({ values }),
	};
};

type mtappStore = ReturnType<typeof createMtAppStore>;

const createMtAppStore = (initProps?: Partial<ConfirmModalProps>) => {
	const initialState = { ...initProps };
	return createStore<ConfirmModalState>()((...a) => ({
		...createAppSlice(...a),
		...initialState,
	}));
};
export const gomtmContext = createContext<mtappStore | null>(null);

type AppProviderProps = React.PropsWithChildren<ConfirmModalProps>;
export const ConfirmModalProvider = (props: AppProviderProps) => {
	const { children, ...etc } = props;
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const mystore = useMemo(() => createMtAppStore(etc), [etc]);
	return (
		<gomtmContext.Provider value={mystore}>
			{children}
			<ConfirmModal />
		</gomtmContext.Provider>
	);
};

const DEFAULT_USE_SHALLOW = true;
export function useConfirmStore(): ConfirmModalState;
export function useConfirmStore<T>(
	selector: (state: ConfirmModalState) => T,
): T;
export function useConfirmStore<T>(selector?: (state: ConfirmModalState) => T) {
	const store = useContext(gomtmContext);
	if (!store) throw new Error("useConfirmStore must in ConfirmModalProvider");
	if (selector) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		return useStore(
			store,
			DEFAULT_USE_SHALLOW ? useShallow(selector) : selector,
		);
	}
	// eslint-disable-next-line react-hooks/rules-of-hooks
	return useStore(store);
}

interface ConfirmModalOptions {
	title?: string;
	message: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: (values) => void;
	onCancel?: () => void;
}
interface UseConfirmProps extends ConfirmModalProps {
	options: ConfirmModalOptions;
}
export const useConfirm = (props: UseConfirmProps) => {
	const setOpen = useConfirmStore((x) => x.setOpen);
	const setOnConfirm = useConfirmStore((x) => x.setOnConfirm);
	const setOptions = useConfirmStore((x) => x.setOptions);
	const setValues = useConfirmStore((x) => x.setValues);

	useEffect(() => {
		setOptions(props.options);
		setOnConfirm(props.options.onConfirm);
	}, [props.options, setOptions, setOnConfirm]);

	const showConfirm = useCallback(
		(values) => {
			setOpen(true);
			setValues(values);
		},
		[setOpen, setValues],
	);

	return {
		showConfirm: showConfirm,
	};
};

/**
 * 因 确认提示框的状态处理看起来有点点复杂，因此 UI 暂时使用 浏览器元素的 confirm api 实现。
 * @param message
 * @param onConfirm
 * @param onAbort
 * @returns
 */
export function useConfirmV2(message, onConfirm, onAbort) {
	const confirm = useCallback(
		(values) => {
			if (window.confirm(message)) onConfirm(values);
			else onAbort();
		},
		[message, onConfirm, onAbort],
	);
	return confirm;
}
