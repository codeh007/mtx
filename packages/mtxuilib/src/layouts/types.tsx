export interface DashASiderProps {
	isCollapsed?: boolean;
}

export interface DashSettingsProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	obj?: any;
}

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
