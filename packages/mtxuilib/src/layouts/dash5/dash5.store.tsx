"use client";

import { createContext, useContext, useMemo } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import type { Renderable } from "../../lib/render";

export interface DashASiderProps {
	isCollapsed?: boolean;
}

// export interface DashSettingsProps {
// 	obj?: Record<string, any>;
// }

export interface DashHeaderProps {
	hidden?: boolean;
}

export interface SiderNavItemProps {
	title?: string | null;
	label?: string | null;
	icon?: string | null;
	variant?: "default" | "ghost";
	url?: string | null;
}
export interface NavProps {
	isCollapsed?: boolean;
	isActive?: boolean;
	items: SiderNavItemProps[];
}


/**
 * 主布局配置
 */
export const dash5LayoutDefaultConfig = {
	//最左侧
	asideIsCollapsed: false,
	asideCollapsedSize: 4, // %20
	asideDefaultSize: 20, // %20
	asiderMinSize: 8,
	asiderMaxSize: 24,
	asiderCollapsible: true,

	// 中间(如果没有右侧面板，这里就是主面板)
	mainPanelDefaultSize: 80, // %80
	mainPanelMinSize: 30,
	mainPanelMaxSize: 100, // %90
	// 右侧 默认隐藏
	middlePanelDefaultSize: 0,
	// layout store key
	layoutStoreKey: "dash5layout-resizable-panels:layout",
};

export type Dash5LayoutProps = {
	headerComponent?: Renderable<DashASiderProps>;
	aSiderRender?: (props: DashASiderProps) => React.ReactNode;
	// settingsRender?: (props: DashSettingsProps) => React.ReactNode;
};

export interface Dash5LayoutState extends Dash5LayoutProps {
	_hasHydrated?: boolean;
	layoutConfig: typeof dash5LayoutDefaultConfig;
	setHasHydrated: (_hasHydrated: boolean) => void;
	setIsSideCollapsed: (isSideCollapsed: boolean) => void;
	toggleAsideCollapsed: () => void;
}

export const createAppSlice: StateCreator<
	Dash5LayoutState,
	[],
	[],
	Dash5LayoutState
> = (set, get, init) => {
	return {
		isDev: false,
		isCollapsed: false,
		layoutConfig: dash5LayoutDefaultConfig,
		...init,
		setHasHydrated: (_hasHydrated: boolean) => set({ _hasHydrated }),
		setIsSideCollapsed: (isSideCollapsed: boolean) => {
			console.log("isSideCollapsed", isSideCollapsed);
			const pre = get().layoutConfig;
			set({ layoutConfig: { ...pre, asideIsCollapsed: isSideCollapsed } });
		},
		toggleAsideCollapsed: () => {
			const pre = get().layoutConfig;
			set({
				layoutConfig: { ...pre, asideIsCollapsed: !pre.asideIsCollapsed },
			});
		},
	};
};

type mtappStore = ReturnType<typeof createMtAppStore>;

const createMtAppStore = (initProps?: Partial<Dash5LayoutProps>) => {
	const initialState = { ...initProps };
	return createStore<Dash5LayoutState>()(
		persist(
			devtools(
				immer((...a) => ({
					...createAppSlice(...a),
					...initialState,
				})),
				{
					name: "Dash5Layout",
				},
			),
			{
				name: "Dash5Layout",
				skipHydration: true,
				version: 4,
				onRehydrateStorage: () => (state, error) => {
					state?.setHasHydrated(true);
				},
				partialize: (state) => {
					return Object.fromEntries(
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						Object.entries(state as any).filter(([key]) => {
							//排除
							return !["children", "_hasHydrated", "siderComponent"].includes(
								key,
							);
						}),
					);
				},
			},
		),
	);
};
export const gomtmContext = createContext<mtappStore | null>(null);

type AppProviderProps = React.PropsWithChildren<Dash5LayoutProps>;
export const Dash5LayoutProvider = (props: AppProviderProps) => {
	const { children, ...etc } = props;
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const mystore = useMemo(() => createMtAppStore(etc), [etc]);
	return (
		<gomtmContext.Provider value={mystore}>{children}</gomtmContext.Provider>
	);
};

const DEFAULT_USE_SHALLOW = true;
export function useDash5Store(): Dash5LayoutState;
export function useDash5Store<T>(selector: (state: Dash5LayoutState) => T): T;
export function useDash5Store<T>(selector?: (state: Dash5LayoutState) => T) {
	const store = useContext(gomtmContext);
	if (!store) throw new Error("useDash5Store must in Dash5LayoutProvider");
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
