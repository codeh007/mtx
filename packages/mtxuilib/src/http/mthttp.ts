export function isHtmlResponse(response: Response) {
  const contentType = response.headers.get("Content-Type");
  return contentType?.includes("text/html");
}

export function makeHtmlResponse(html: string, refResponse?: Response) {
  const headers = refResponse?.headers;
  return new Response(html, { headers: headers });
}

export type FetchType = typeof fetch;

export const responseJson = (data) => {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-type": "application/json",
    },
  });
};

/**
 * @deprecated 改用: jsonResponseV2
 */
export async function jsonResponse(data, headers?: HeadersInit) {
  try {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...(headers && { ...headers }),
      },
    });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: (e as Error).message }));
  }
}

export async function jsonResponseV2(body?: any, init?: ResponseInit) {
  if (typeof body === "object") {
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  }
  return new Response(body, init);
}

export async function jsonSuccessResponse(data?) {
  return jsonResponseV2({
    success: true,
    data,
  });
}

export async function errorJsonResponse(data) {
  return new Response(JSON.stringify(data), {
    status: 500,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// export async function jsxResponse(element: JSX.Element) {
// 	const reactDomServer = await import("react-dom/server");
// 	return new Response(reactDomServer.renderToString(element));
// }

export function getContentType(req: Request) {
  const a = req.headers.get("Content-Type");
  return a;
}

export async function jsonPost(url: string, data) {
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function getHttpJsonParams<T>(req: Request) {
  let obj = Object.fromEntries(new URL(req.url).searchParams);
  if (req.method === "POST") {
    obj = { ...obj, ...((await req.json()) as T) };
  }
  return obj;
}

export function getCookieFromReq(req: Request, cookieName: string) {
  const cookieStr = req?.headers.get("Cookie");
  if (cookieStr) {
    return getCookieByName(cookieName, cookieStr);
  }
  return "";
}
function getCookieByName(name: string, cookieStr: string) {
  const cookieArr = cookieStr.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split("=");
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
}
