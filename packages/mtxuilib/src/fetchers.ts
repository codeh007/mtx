import { z } from "zod";
export const CRAWL_FETCH_TYPE = ["fetch", "puppeteer"] as const;
const fetchTypeSchema = z.enum(CRAWL_FETCH_TYPE);

export type FETCHTYPE = z.infer<typeof fetchTypeSchema>;

export function getFetcher(fetchType: FETCHTYPE) {
  const fetcher: typeof fetch = fetch;
  if (fetchType === "puppeteer") {
    // fetcher = newPuppeteerFetcher();
  }
  return fetcher;
}
