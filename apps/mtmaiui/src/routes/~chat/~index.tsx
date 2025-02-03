import { createFileRoute } from "@tanstack/react-router";
import { useTenant } from "../../hooks/useAuth";
import { useMtmaiV2 } from "../../stores/StoreProvider";

export const Route = createFileRoute("/chat/")({
	component: RouteComponent,
});

function RouteComponent() {
	const tenant = useTenant();
	const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl);
	if (!tenant) {
		null;
	}
	if (!selfBackendend) {
		null;
	}
	return (
		<>
			<div className="flex items-center justify-center h-full">
				No session selected. Create or select a session from the sidebar.
			</div>
		</>
	);
}
