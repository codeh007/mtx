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
  return new StreamingResponse(makeStream(asyncGenerator));
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
const encoder = new TextEncoder();

export const makeStream = <T>(generator: AsyncGenerator<T, void, unknown>) => {
  return new ReadableStream<any>({
    async start(controller) {
      for await (const chunk of generator) {
        // 必须是 Uint8Array 否则 cloudflare worker 不兼容
        controller.enqueue(encoder.encode(`${chunk}`));
      }
      controller.close();
    },
  });
};

export function emitText(text: string) {
  return `0:${JSON.stringify(text)}\n`;
}

// export async function chatCompletionStream(stream) {
//   return new ReadableStream({
//     async start(controller) {
//       for await (const chunk of stream) {
//         if (chunk.choices[0].delta.finish_reason) {
//           controller.enqueue(
//             encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`),
//           );
//           controller.close();
//           return;
//         }
//         if (chunk.choices[0].delta.content === undefined) {
//           controller.enqueue(encoder.encode("data: [DONE]\n\n"));
//           controller.close();
//           return;
//         }
//         console.log(chunk.choices[0].delta.content);
//         controller.enqueue(
//           encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`),
//         );
//       }
//     },
//   });
// }

// export async function chatStream(stream) {
//   return new ReadableStream({
//     async start(controller) {
//       for await (const chunk of stream) {
//         if (chunk.choices[0].delta.finish_reason) {
//           controller.enqueue(
//             encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`),
//           );
//           controller.close();
//           return;
//         }
//         if (chunk.choices[0].delta.content === undefined) {
//           controller.enqueue(encoder.encode("data: [DONE]\n\n"));
//           controller.close();
//           return;
//         }
//         console.log(chunk.choices[0].delta.content);
//         controller.enqueue(
//           encoder.encode(`0:"${chunk.choices[0].delta.content}" \n`),
//         );
//       }
//     },
//   });
// }
