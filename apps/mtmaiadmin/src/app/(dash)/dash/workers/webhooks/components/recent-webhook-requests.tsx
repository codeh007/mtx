"use client";

import { Badge } from "lucide-react";
import { useMtmClient } from "mtmaiui/hooks/useMtmapi";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

interface RecentRequestProps {
  webhookId: string;
  onConnected?: () => void;
  filterBeforeNow?: boolean;
}

const StatusCodeToMessage: Record<number, string> = {
  200: "Server can receive run requests!",
  401: "Unauthorized",
  403: "Forbidden, Check if worker path is correct",
  404: "Not Found, Check if worker path is correct",
  500: "Internal Server Error, See server worker logs",
  502: "Bad Gateway, Check if domain is correct and the server is running",
};

export const RecentWebhookRequests: React.FC<RecentRequestProps> = ({
  webhookId,
  onConnected,
  filterBeforeNow = false,
}) => {
  const [timeAfter] = useState(filterBeforeNow ? Date.now() : undefined);
  const mtmapi = useMtmClient();
  const webhookRequestQuery = mtmapi.useQuery(
    "get",
    "/api/v1/webhook-workers/{webhook}/requests",
    {
      params: {
        path: {
          webhook: webhookId,
        },
      },
    },
    {
      refetchInterval: 1000,
    },
  );

  const filteredRequests = timeAfter
    ? webhookRequestQuery.data?.requests?.filter(
        (request) => new Date(request.created_at).getTime() > timeAfter,
      )
    : webhookRequestQuery.data?.requests;

  useEffect(() => {
    if (!onConnected) {
      return;
    }

    if (!filteredRequests || filteredRequests.length === 0) {
      return;
    }

    if (filteredRequests[0].statusCode === 200) {
      onConnected();
    }
  }, [onConnected, filteredRequests]);

  const logLines = useMemo(() => {
    return (filteredRequests || []).map<ExtendedLogLine>((request) => {
      return {
        line: StatusCodeToMessage[request.statusCode],
        timestamp: request.created_at,
        instance: "",
        badge: (
          <Badge
            className="mr-4"
            variant={request.statusCode === 200 ? "successful" : "failed"}
          >
            {request.statusCode}
          </Badge>
        ),

        // statusCode: request.statusCode,
        // createdAt: request.created_at,
        // message: StatusCodeToMessage[request.statusCode],
        // metadata: {},
      };
    });
  }, [filteredRequests]);

  if (webhookRequestQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (webhookRequestQuery.isError) {
    return <div>Error: {webhookRequestQuery.error?.message}</div>;
  }

  if (
    !webhookRequestQuery.data ||
    !webhookRequestQuery.data.requests ||
    webhookRequestQuery.data.requests.length === 0
  ) {
    return <div>Attempting to connect...</div>;
  }

  return (
    <>
      <LoggingComponent
        logs={logLines}
        onTopReached={() => {}}
        onBottomReached={() => {}}
        autoScroll={false}
      />
    </>
  );
};
