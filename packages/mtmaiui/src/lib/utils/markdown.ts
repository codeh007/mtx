import rehypeSanitize, {
	defaultSchema,
	type Options as RehypeSanitizeOptions,
} from "rehype-sanitize";
import type { PluggableList, Plugin } from "unified";

import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { Node, Parent } from "unist";
import { SKIP, visit } from "unist-util-visit";

export const allowedHTMLElements = [
	"a",
	"b",
	"blockquote",
	"br",
	"code",
	"dd",
	"del",
	"details",
	"div",
	"dl",
	"dt",
	"em",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"hr",
	"i",
	"ins",
	"kbd",
	"li",
	"ol",
	"p",
	"pre",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"source",
	"span",
	"strike",
	"strong",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead",
	"tr",
	"ul",
	"var",
	//----------------------------自定义
	"askHuman",
	"askhuman",
];

const rehypeSanitizeOptions: RehypeSanitizeOptions = {
	...defaultSchema,
	tagNames: allowedHTMLElements,
	attributes: {
		...defaultSchema.attributes,
		div: [
			...(defaultSchema.attributes?.div ?? []),
			"data*",
			["className", "__boltArtifact__"],
		],
		askhuman: [
			...(defaultSchema.attributes?.askHuman ?? []),
			"data*",
			"title",
			["className", "__boltArtifact__"],
		],
	},
	strip: [],
};

export function remarkPlugins(limitedMarkdown: boolean) {
	const plugins: PluggableList = [remarkGfm];

	if (limitedMarkdown) {
		plugins.unshift(limitedMarkdownPlugin);
	}

	return plugins;
}

export function rehypePlugins(html: boolean) {
	const plugins: PluggableList = [];

	if (html) {
		plugins.push(rehypeRaw, [rehypeSanitize, rehypeSanitizeOptions]);
	}

	return plugins;
}

const limitedMarkdownPlugin: Plugin = () => {
	return (tree, file) => {
		const contents = file.toString();

		// import type { UnistNode, UnistParent } from 'unist-util-visit';
		visit(tree, (node: Node, index, parent: Parent) => {
			if (
				index == null ||
				[
					"paragraph",
					"text",
					"inlineCode",
					"code",
					"strong",
					"emphasis",
					"askHuman", // 添加 askHuman 到允许的类型列表中
					"askhuman",
				].includes(node.type) ||
				!node.position
			) {
				return true;
			}

			let value = contents.slice(
				node.position.start.offset,
				node.position.end.offset,
			);

			if (node.type === "heading") {
				value = `\n${value}`;
			}

			parent.children[index] = {
				type: "text",
				value,
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} as any;

			return [SKIP, index] as const;
		});
	};
};
