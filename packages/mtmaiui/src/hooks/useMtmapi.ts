"use client";
import type { paths } from "mtmaiapi/query_client/generated"; // generated by openapi-typescript
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { useMemo } from "react";

export function useMtmClient() {
  const serverUrl = useMtmaiV2((x) => x.serverUrl);
  const accessToken = useMtmaiV2((x) => x.accessToken);
  const $mtmapi = useMemo(() => {
    const fetchClient = createFetchClient<paths>({
      baseUrl: serverUrl,
      credentials: "include",
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return createClient(fetchClient);
  }, [serverUrl, accessToken]);
  return $mtmapi;
}