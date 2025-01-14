/**************************************************************************************
 *  实用工具，传入一个生成器，yield 出来的对象作为stream 字符串传递到前端
 * api端这样使用：
 * const response = newStreamResponse(fetchItems());
 * return response;
 *
 * 生成器例子:
 *    async function* exampleFetchItems(): AsyncGenerator<any, void, unknown> {
      const sleep = async (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      for (let i = 0; i < 10; ++i) {
        await sleep(1000);
        yield {
          key: `key${i}`,
          value: `value${i}`,
        };
      }
    }
*************************************************************************************/
export function newStreamResponse(
  asyncGenerator: AsyncGenerator<any, void, unknown>,
) {
  const stream = makeStream(asyncGenerator);
  const response = new StreamingResponse(stream);
  return response;

  // return new StreamingResponse(res, init);
}

/**
 * A custom Response subclass that accepts a ReadableStream.
 * This allows creating a streaming Response for async generators.
 */
export class StreamingResponse extends Response {
  constructor(res: ReadableStream<any>, init?: ResponseInit) {
    super(res as any, {
      ...init,
      status: 200,
      headers: {
        ...init?.headers,
        "Content-Type": "text/event-stream",
      },
    });
  }
}

export const makeStream = <T extends Record<string, unknown>>(
  generator: AsyncGenerator<T, void, unknown>,
) => {
  const encoder = new TextEncoder();
  return new ReadableStream<any>({
    async start(controller) {
      for await (const chunk of generator) {
        // const chunkData = encoder.encode(JSON.stringify(chunk));
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
};
