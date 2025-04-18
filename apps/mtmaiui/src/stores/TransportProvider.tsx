import type { DescService } from "@bufbuild/protobuf";
import {
  type Client,
  type Interceptor,
  createClient,
} from "@connectrpc/connect";
import { TransportProvider } from "@connectrpc/connect-query";
import { createConnectTransport } from "@connectrpc/connect-web";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AgService } from "mtmaiapi/mtmclient/mtmai/mtmpb/ag_pb";
import { MtmService } from "mtmaiapi/mtmclient/mtmai/mtmpb/mtm_pb";
import { useMemo } from "react";
import { useTenantId } from "../hooks/useAuth";
import { useMtmaiV2 } from "./StoreProvider";

const queryClient = new QueryClient();

interface MtTransportProviderProps {
  children: React.ReactNode;
}
export function MtTransportProvider({ children }: MtTransportProviderProps) {
  const accessToken = useMtmaiV2((x) => x.accessToken);

  const tid = useTenantId();

  const transport = useGomtmTransport({ accessToken, tenantId: tid });
  return (
    <TransportProvider transport={transport}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TransportProvider>
  );
}

export function useGomtmTransport({
  accessToken,
  tenantId,
}: {
  accessToken?: string;
  tenantId?: string;
}) {
  const backendUrl = useMtmaiV2((x) => x.serverUrl);

  const logger: Interceptor = useMemo(
    () => (next) => async (req) => {
      if (tenantId) {
        req.header.set("X-Tid", tenantId);
      }
      if (accessToken) {
        req.header.set("Authorization", `Bearer ${accessToken}`);
      }
      return await next(req);
    },
    [tenantId, accessToken],
  );

  const transport = useMemo(
    () =>
      createConnectTransport({
        baseUrl: `${backendUrl}/mtmapi`,
        // By default, this transport uses the JSON format.
        // Set this option to true to use the binary format.
        useBinaryFormat: false,

        // Interceptors apply to all calls running through this transport.
        interceptors: [logger],

        // By default, all requests use POST. Set this option to true to use GET
        // for side-effect free RPCs.
        useHttpGet: false,
      }),
    [backendUrl, logger],
  );
  return transport;
}
/**
 * Get a promise client for the given service.
 */
export function useGomtmClient<T extends DescService>(service: T): Client<T> {
  // We memoize the client, so that we only create one instance per service.
  const accessToken = useMtmaiV2((x) => x.accessToken);
  const tenantId = useTenantId();
  const transport = useGomtmTransport({ accessToken, tenantId });
  return useMemo(() => createClient(service, transport), [service, transport]);
}

export function useAgService() {
  return useGomtmClient(AgService);
}

export function useMtmService() {
  return useGomtmClient(MtmService);
}
