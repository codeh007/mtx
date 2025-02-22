import type { DescService } from "@bufbuild/protobuf";
import { type Client, createClient } from "@connectrpc/connect";
import { TransportProvider } from "@connectrpc/connect-query";
import { createConnectTransport } from "@connectrpc/connect-web";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

export const transport = createConnectTransport({
  baseUrl: "https://colab-gomtm.yuepa8.com",
  // By default, this transport uses the JSON format.
  // Set this option to true to use the binary format.
  useBinaryFormat: false,

  // Interceptors apply to all calls running through this transport.
  interceptors: [],

  // By default, all requests use POST. Set this option to true to use GET
  // for side-effect free RPCs.
  useHttpGet: false,

  // Optional override of the fetch implementation used by the transport.
  fetch: globalThis.fetch,

  // Options for Protobuf JSON serialization.
  jsonOptions: {},
});

const queryClient = new QueryClient();

export function MtTransportProvider({
  children,
}: { children: React.ReactNode }) {
  return (
    <TransportProvider transport={transport}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TransportProvider>
  );
}

/**
 * Get a promise client for the given service.
 */
export function useGomtmClient<T extends DescService>(service: T): Client<T> {
  // We memoize the client, so that we only create one instance per service.
  return useMemo(() => createClient(service, transport), [service]);
}
