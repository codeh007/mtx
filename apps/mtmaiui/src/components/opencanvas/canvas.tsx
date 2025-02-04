"use client";

import type {
	ArtifactCodeV3,
	ArtifactMarkdownV3,
	ArtifactV3,
	ProgrammingLanguageOptions,
} from "mtmaiapi";
import { getLanguageTemplate } from "mtxuilib/agentutils/get_language_template";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { cn } from "mtxuilib/lib/utils";
import { useToast } from "mtxuilib/ui/use-toast";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useGraphStore } from "../../stores/GraphContext";
import { ContentComposerChatInterface } from "./content-composer";

const LZArtifactRenderer = dynamic(
	() =>
		import("./artifacts/ArtifactRenderer").then((mod) => mod.ArtifactRenderer),
	{
		ssr: false,
	},
);

export function CanvasComponent() {
	const { toast } = useToast();
	const chatStarted = useGraphStore((x) => x.chatStarted);
	const setChatStarted = useGraphStore((x) => x.setChatStarted);
	const openWorkBench = useGraphStore((x) => x.openWorkBench);
	const setOpenWorkBench = useGraphStore((x) => x.setOpenWorkBench);
	const [isEditing, setIsEditing] = useState(false);

	// useEffect(() => {
	//   if (!threadId || !user) return;
	//   // Clear threads with no values
	//   clearThreadsWithNoValues(user.id);
	// }, [threadId, user]);

	const handleQuickStart = (
		type: "text" | "code",
		language?: ProgrammingLanguageOptions,
	) => {
		if (type === "code" && !language) {
			toast({
				title: "Language not selected",
				description: "Please select a language to continue",
				duration: 5000,
			});
			return;
		}
		setChatStarted(true);

		let artifactContent: ArtifactCodeV3 | ArtifactMarkdownV3;
		if (type === "code" && language) {
			artifactContent = {
				index: 1,
				type: "code",
				title: `Quick start ${type}`,
				code: getLanguageTemplate(language),
				language,
			};
		} else {
			artifactContent = {
				index: 1,
				type: "text",
				title: `Quick start ${type}`,
				fullMarkdown: "",
			};
		}

		const newArtifact: ArtifactV3 = {
			currentIndex: 1,
			contents: [artifactContent],
		};
		// Do not worry about existing items in state. This should
		// never occur since this action can only be invoked if
		// there are no messages/artifacts in the thread.
		// setArtifact(newArtifact);
		setIsEditing(true);
	};

	return (
		<main className="h-screen flex flex-row">
			<div
				className={cn(
					"transition-all duration-700",
					openWorkBench ? "w-[35%]" : "w-full",
					"h-full mr-auto bg-gray-50/70 shadow-inner-right",
				)}
			>
				<ContentComposerChatInterface
					switchSelectedThreadCallback={(thread) => {
						// Chat should only be "started" if there are messages present
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						if ((thread.values as Record<string, any>)?.messages?.length) {
							setChatStarted(true);
							// setModelName(
							//   thread?.metadata?.customModelName as ALL_MODEL_NAMES,
							// );
						} else {
							setChatStarted(false);
						}
					}}
					setChatStarted={setChatStarted}
					hasChatStarted={chatStarted ?? false}
					handleQuickStart={handleQuickStart}
				/>
			</div>

			{openWorkBench && (
				<MtSuspenseBoundary>
					<div className="w-full ml-auto">
						<LZArtifactRenderer
							setIsEditing={setIsEditing}
							isEditing={isEditing}
						/>
					</div>
				</MtSuspenseBoundary>
			)}
		</main>
	);
}

export const Canvas = React.memo(CanvasComponent);
