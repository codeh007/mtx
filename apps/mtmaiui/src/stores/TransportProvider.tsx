import type { DescService } from "@bufbuild/protobuf";
import {
  type Client,
  type Interceptor,
  createClient,
} from "@connectrpc/connect";
import { TransportProvider } from "@connectrpc/connect-query";
import { createConnectTransport } from "@connectrpc/connect-web";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { useMtmaiV2 } from "./StoreProvider";

const queryClient = new QueryClient();

interface MtTransportProviderProps {
  children: React.ReactNode;
  accessToken: string;
}
export function MtTransportProvider({
  children,
  accessToken,
}: MtTransportProviderProps) {
  const transport = useGomtmTransport({ accessToken });
  return (
    <TransportProvider transport={transport}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TransportProvider>
  );
}

const logger: Interceptor = (next) => async (req) => {
  console.log(`sending message to ${req.url}`);
  return await next(req);
};

export function useGomtmTransport({ accessToken }: { accessToken?: string }) {
  const transport = useMemo(
    () =>
      createConnectTransport({
        baseUrl: "http://localhost:8383",
        // By default, this transport uses the JSON format.
        // Set this option to true to use the binary format.
        useBinaryFormat: false,

        // Interceptors apply to all calls running through this transport.
        interceptors: [logger],

        // By default, all requests use POST. Set this option to true to use GET
        // for side-effect free RPCs.
        useHttpGet: false,

        // Optional override of the fetch implementation used by the transport.
        // fetch: globalThis.fetch,
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          return globalThis.fetch(input, {
            ...init,
            headers: {
              ...init?.headers,
              // ...(accessToken && {
              //   Authorization: `Bearer ${accessToken}`,
              // }),
            },
          });
        },

        // Options for Protobuf JSON serialization.
        // jsonOptions: {},
      }),
    [accessToken],
  );
  return transport;
}
/**
 * Get a promise client for the given service.
 */
export function useGomtmClient<T extends DescService>(service: T): Client<T> {
  // We memoize the client, so that we only create one instance per service.
  const accessToken = useMtmaiV2((x) => x.accessToken);
  const transport = useGomtmTransport({ accessToken });
  return useMemo(() => createClient(service, transport), [service, transport]);
}
