// import { Logger } from "./logger";

const DEFAULT_RETRY_INTERVAL = 5; // seconds
const DEFAULT_RETRY_COUNT = 5;

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export async function retrier<T>(
  fn: () => Promise<T>,
  // logger: Logger,
  retries: number = DEFAULT_RETRY_COUNT,
  interval: number = DEFAULT_RETRY_INTERVAL,
) {
  let lastError: Error | undefined;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      lastError = e;
      console.error(`Error: ${e.message}`);
      await sleep(interval * 1000);
    }
  }

  throw lastError;
}
