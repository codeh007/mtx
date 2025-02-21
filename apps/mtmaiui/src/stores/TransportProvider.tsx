import { TransportProvider } from "@connectrpc/connect-query";
import { createConnectTransport } from "@connectrpc/connect-web";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const finalTransport = createConnectTransport({
  baseUrl: "https://colab-gomtm.yuepa8.com",
});

const queryClient = new QueryClient();

export function MtTransportProvider({
  children,
}: { children: React.ReactNode }) {
  return (
    <TransportProvider transport={finalTransport}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TransportProvider>
  );
}
