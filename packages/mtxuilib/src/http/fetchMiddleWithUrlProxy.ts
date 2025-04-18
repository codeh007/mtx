
import type { FetchType } from "./mthttp"


export function fetchMiddleWithUrlProxy(fetcher: FetchType) {
  // 更详细的 stream api 参考： 
  // https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_byte_streams
  return async (input: string | URL | globalThis.Request, init?: RequestInit) => {
    return fetcher(input, init)
  }
}
