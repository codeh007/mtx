import { useEffect } from "react";

/**实验性代码，没实际用途 */
export interface EventStreamProps {
	endpoint_url: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onData: (data: any) => void;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onError?: (error: any) => void;
}
export const useAgentEventStream = (props: EventStreamProps) => {
	const { endpoint_url: apiUrl, onData, onError } = props;
	useEffect(() => {
		const controller = new AbortController();
		const run = async (controller: AbortController) => {
			try {
				const response = await fetch(apiUrl, {
					signal: controller.signal,
				});

				if (!response.body) {
					throw new Error("ReadableStream not supported");
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let done = false;
				while (!done) {
					const { value, done: readerDone } = await reader.read();
					done = readerDone;
					const line = decoder.decode(value, { stream: true });

					if (line?.trim()) {
						const strval = decoder.decode(value, { stream: true });
						if (strval) {
							const colonIndex = strval.indexOf(":");
							if (colonIndex > 0) {
								const jsonString = strval.slice(colonIndex + 1).trim();
								try {
									const parsedItem = JSON.parse(jsonString);
									// setItems((prevItems) => [...prevItems, parsedItem]);
									onData?.(parsedItem);
									// setItem(parsedItem);
								} catch (parseError) {
									console.error("Failed to parse item:", parseError);
								}
							}
						}
					}
				}
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {}
		};

		run(controller);

		return () => controller.abort();
	}, [apiUrl, onData]);
	return null;
};
