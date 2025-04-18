export interface SearxngSearchOptions {
  categories?: string[];
  engines?: string[];
  language?: string;
  pageno?: number;
}

export interface SearxngSearchResult {
  title: string;
  url: string;
  img_src?: string;
  thumbnail_src?: string;
  thumbnail?: string;
  content?: string;
  author?: string;
  iframe_src?: string;
}

export const searchSearxng = async (
  searxngURL: string,
  query: string,
  opts?: SearxngSearchOptions,
) => {
  const url = new URL(`${searxngURL}/search?format=json`);
  url.searchParams.append("q", query);

  if (opts) {
    for (const [key, value] of Object.entries(opts)) {
      const paramValue = Array.isArray(value) ? value.join(",") : value;
      url.searchParams.append(key, paramValue);
    }
  }

  const res = await fetch(url.toString());
  const data = (await res.json()) as {
    results: SearxngSearchResult[];
    suggestions: string[];
  };

  const results: SearxngSearchResult[] = data.results;
  const suggestions: string[] = data.suggestions;

  return { results, suggestions };
};
