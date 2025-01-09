
import { match } from "path-to-regexp";

export function isMatchSlug(slugPath: string, route: string): boolean {
  const fn = match(route, { decode: decodeURIComponent });
  const result = fn(slugPath);
  if (result) {
    return true
  }
  return false
}
