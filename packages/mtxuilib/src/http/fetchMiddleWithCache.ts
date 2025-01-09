import { LRUCache } from "lru-cache";
import { sha256WithAlphabets } from "../lib/hash";
import type { FetchType } from "./mthttp";

// type makeCacheKeyFn = (req: string | URL | globalThis.Request) => Promise<string>

//cache ==================================================================================

const options: LRUCache.Options<any, any, any> = {
  max: 500,
  // for use with tracking overall storage size
  maxSize: 5000,
  sizeCalculation: (value, key) => {
    return 1;
  },
  // for use when you need to clean up something when objects
  // are evicted from the cache
  // dispose: (value, key) => {
  //   // freeFromMemoryOrWhatever(value)
  // },
  ttl: 1000 * 60,
  // return stale items before removing from cache?
  allowStale: false,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
};

const cache = new LRUCache(options);
const makeCacheKey = (
  input: string | URL | globalThis.Request,
  init?: RequestInit,
) => {
  const req = new Request(input, init);
  const token = req.headers.get("authorization") as string;
  let body = "";
  if (init?.body) {
    body = init.body.toString();
  }

  const _input = input || "";
  const _token = token || "";
  const _body = body || "";
  // console.log("cache full key", _input + _token + _body)
  return sha256WithAlphabets(_input + _token + _body);
};
export function fetchMiddleWithCache(fetcher: FetchType) {
  // 更详细的 stream api 参考： https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_byte_streams
  return async (
    input: string | URL | globalThis.Request,
    init?: RequestInit,
  ) => {
    const key = await makeCacheKey(input, init);
    const cacheObj = cache.get(key);
    if (cacheObj) {
      console.log("[fetch hint cache]", key);
      return new Response(new Uint8Array(cacheObj as ArrayBuffer));
    }
    const response = await fetcher(input, init);
    if (response.status == 200 && response.body) {
      const [s1, s2] = response.body.tee();
      writeStreamToCache(key, s2);
      return new Response(s1, response);
    }
    return response.clone();
  };
}

async function writeStreamToCache(key: string, steam: ReadableStream) {
  // console.log("[write fetch cache]", key)
  const chunks: any[] = [];
  let done = false;
  const s2Reader = await steam.getReader();
  while (!done) {
    const { value, done: readerDone } = await s2Reader.read();
    done = readerDone;
    if (value) chunks.push(value);
  }
  const byteArray = new Uint8Array(
    chunks.reduce((acc, chunk) => [...acc, ...Array.from(chunk)], []),
  );
  // 存储到缓存中
  if (byteArray.buffer.byteLength > 0) {
    cache.set(key, byteArray.buffer);
  }
}
