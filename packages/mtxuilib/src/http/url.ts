export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const getDomainWithoutWWW = (url: string) => {
  if (isValidUrl(url)) {
    return new URL(url).hostname.replace(/^www\./, "");
  }
  try {
    if (url.includes(".") && !url.includes(" ")) {
      return new URL(`https://${url}`).hostname.replace(/^www\./, "");
    }
  } catch (e) {
    return null;
  }
};

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function cleanSearchParams(urlSearchParams: URLSearchParams) {
  const cleanedParams = urlSearchParams;
  const keysForDel: any[] = [];

  urlSearchParams.forEach((value, key) => {
    if (value == "null" || value === "undefined" || !value) {
      keysForDel.push(key);
    }
  });

  keysForDel.forEach((key) => {
    cleanedParams.delete(key);
  });

  return cleanedParams;
}

// export function searchString(
//   page: string | null | undefined,
//   search: string | null | undefined,
//   sort?: string | null | undefined,
// ): string {
//   const searchParameters = new URLSearchParams({
//     page,
//     search,
//     sort,
//   });

//   return cleanSearchParams(searchParameters)?.toString();
// }

export function urlJoinPaths(...paths: string[]) {
  const a = paths.join("/");
  return a.replaceAll("//", "/");
}
