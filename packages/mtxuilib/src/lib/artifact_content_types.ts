import type { ArtifactCodeV3, ArtifactMarkdownV3 } from "mtmaiapi";

export const isArtifactCodeContent = (
	content: unknown,
): content is ArtifactCodeV3 => {
	return !!(
		typeof content === "object" &&
		content &&
		"type" in content &&
		content.type === "code"
	);
};

export const isArtifactMarkdownContent = (
	content: unknown,
): content is ArtifactMarkdownV3 => {
	return !!(
		typeof content === "object" &&
		content &&
		"type" in content &&
		content.type === "text"
	);
};
