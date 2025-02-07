import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight, MessagesSquare } from "lucide-react";
import {
  type AgentMessageConfig,
  type Run,
  type RunStatus,
  type Session,
  type TeamResult,
  type WebSocketMessage,
  agentNodeRunMutation,
  teamGetOptions,
} from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { toast } from "mtxuilib/ui/use-toast";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTenant, useUser } from "../../../hooks/useAuth";
import type { IStatus } from "../../components/datamodel";
import ChatInput from "./chatinput";
import { TIMEOUT_CONFIG } from "./consts";
import { RunView } from "./runview";

interface ChatViewProps {
  session: Session | null;
}

export default function ChatView({ session }: ChatViewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IStatus | null>({
    status: true,
    message: "All good",
  });

  // Core state
  const [existingRuns, setExistingRuns] = useState<Run[]>([]);
  const [currentRun, setCurrentRun] = useState<Run | null>(null);
  const chatContainerRef = React.useRef<HTMLDivElement | null>(null);

  const tenant = useTenant();
  const user = useUser();
  const [activeSocket, setActiveSocket] = React.useState<WebSocket | null>(
    null,
  );
  const inputTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const activeSocketRef = React.useRef<WebSocket | null>(null);

  const createMessage = (
    config: AgentMessageConfig,
    runId: string,
    sessionId: number,
  ): Message => ({
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    config,
    session_id: sessionId,
    run_id: runId,
    user_id: user?.email || undefined,
  });

  // Load existing runs when session changes
  const loadSessionRuns = async () => {
    if (!session?.metadata.id || !user?.email) return;

    try {
      // const response = await sessionAPI.getSessionRuns(session.metadata.id, user.email);
      // setExistingRuns(response.runs);
    } catch (error) {
      console.error("Error loading session runs:", error);
      messageApi.error("Failed to load chat history");
    }
  };

  useEffect(() => {
    if (session?.metadata.id) {
      loadSessionRuns();
      setCurrentRun(null);
    } else {
      setExistingRuns([]);
      setCurrentRun(null);
    }
  }, [session?.metadata.id]);

  const teamConfigQuery = useSuspenseQuery({
    ...teamGetOptions({
      path: {
        tenant: tenant!.metadata.id,
        team: session!.teamId,
      },
    }),
  });

  useEffect(() => {
    setTimeout(() => {
      if (chatContainerRef.current && existingRuns.length > 0) {
        // Scroll to bottom to show latest run
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "auto", // Use 'auto' instead of 'smooth' for initial load
        });
      }
    }, 450);
  }, [existingRuns.length, currentRun?.messages]);

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (inputTimeoutRef.current) {
        clearTimeout(inputTimeoutRef.current);
      }
      activeSocket?.close();
    };
  }, [activeSocket]);

  const runMutation = useMutation({
    ...agentNodeRunMutation({}),
  });

  // const chatMutation = useMutation({
  //   ...chatChatMutation({}),
  // });

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    setCurrentRun((current) => {
      if (!current || !session?.id) return null;

      console.log("WebSocket message:", message);

      switch (message.type) {
        case "error":
          if (inputTimeoutRef.current) {
            clearTimeout(inputTimeoutRef.current);
            inputTimeoutRef.current = null;
          }
          if (activeSocket) {
            activeSocket.close();
            setActiveSocket(null);
            activeSocketRef.current = null;
          }
          console.log("Error: ", message.error);

        case "message":
          if (!message.data) return current;

          // Create new Message object from websocket data
          const newMessage = createMessage(
            message.data as AgentMessageConfig,
            current.id,
            session.id,
          );

          return {
            ...current,
            messages: [...current.messages, newMessage],
          };

        case "input_request":
          if (inputTimeoutRef.current) {
            clearTimeout(inputTimeoutRef.current);
          }

          inputTimeoutRef.current = setTimeout(() => {
            const socket = activeSocketRef.current;
            console.log("Input timeout", socket);

            if (socket?.readyState === WebSocket.OPEN) {
              socket.send(
                JSON.stringify({
                  type: "stop",
                  reason: TIMEOUT_CONFIG.DEFAULT_MESSAGE,
                  code: TIMEOUT_CONFIG.WEBSOCKET_CODE,
                }),
              );
              setCurrentRun((prev) =>
                prev
                  ? {
                      ...prev,
                      status: "stopped",
                      error_message: TIMEOUT_CONFIG.DEFAULT_MESSAGE,
                    }
                  : null,
              );
            }
          }, TIMEOUT_CONFIG.DURATION_MS);

          return {
            ...current,
            status: "awaiting_input",
          };
        case "result":
        case "completion":
          // When run completes, move it to existingRuns
          const status: RunStatus =
            message.status === "complete"
              ? "complete"
              : message.status === "error"
                ? "error"
                : "stopped";

          const isTeamResult = (data: any): data is TeamResult => {
            return (
              data &&
              "task_result" in data &&
              "usage" in data &&
              "duration" in data
            );
          };

          const updatedRun = {
            ...current,
            status,
            team_result:
              message.data && isTeamResult(message.data) ? message.data : null,
          };

          // Add to existing runs if complete
          if (status === "complete") {
            if (inputTimeoutRef.current) {
              clearTimeout(inputTimeoutRef.current);
              inputTimeoutRef.current = null;
            }
            if (activeSocket) {
              activeSocket.close();
              setActiveSocket(null);
              activeSocketRef.current = null;
            }
            setExistingRuns((prev) => [...prev, updatedRun]);
            return null;
          }

          return updatedRun;

        default:
          return current;
      }
    });
  };

  const handleError = (error: any) => {
    console.error("Error:", error);
    toast({
      title: "Error",
      description: "Error during request processing",
    });

    setCurrentRun((current) => {
      if (!current) return null;

      const errorRun = {
        ...current,
        status: "error" as const,
        error_message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };

      // Add failed run to existing runs
      setExistingRuns((prev) => [...prev, errorRun]);
      return null; // Clear current run
    });

    setError({
      status: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  };

  const handleInputResponse = async (response: string) => {
    if (!activeSocketRef.current || !currentRun) return;

    if (activeSocketRef.current.readyState !== WebSocket.OPEN) {
      console.error(
        "Socket not in OPEN state:",
        activeSocketRef.current.readyState,
      );
      handleError(new Error("WebSocket connection not available"));
      return;
    }

    // Clear timeout when response received
    if (inputTimeoutRef.current) {
      clearTimeout(inputTimeoutRef.current);
      inputTimeoutRef.current = null;
    }

    try {
      console.log("Sending input response:", response);
      activeSocketRef.current.send(
        JSON.stringify({
          type: "input_response",
          response: response,
        }),
      );

      setCurrentRun((current) => {
        if (!current) return null;
        return {
          ...current,
          status: "active",
        };
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancel = async () => {
    if (!activeSocketRef.current || !currentRun) return;

    // Clear timeout when manually cancelled
    if (inputTimeoutRef.current) {
      clearTimeout(inputTimeoutRef.current);
      inputTimeoutRef.current = null;
    }
    try {
      activeSocketRef.current.send(
        JSON.stringify({
          type: "stop",
          reason: "Cancelled by user",
        }),
      );

      setCurrentRun((current) => {
        if (!current) return null;
        return {
          ...current,
          status: "stopped",
        };
      });
    } catch (error) {
      handleError(error);
    }
  };

  const runTask = async (query: string) => {
    console.log("runTask", query);
    setError(null);
    setLoading(true);

    // Add explicit cleanup
    if (activeSocket) {
      activeSocket.close();
      setActiveSocket(null);
      activeSocketRef.current = null;
    }
    if (inputTimeoutRef.current) {
      clearTimeout(inputTimeoutRef.current);
      inputTimeoutRef.current = null;
    }

    if (!session?.metadata.id || !teamConfigQuery.data) {
      // Add teamConfig check
      setLoading(false);
      return;
    }

    try {
      const response = await chatMutation.mutateAsync({
        path: {
          tenant: tenant!.metadata.id,
          // session: session!.metadata.id,
        },
        body: {
          // session_id: session.metadata.id,
          // user_id: user?.email || "",
          messages: [
            {
              id: "1",
              createdAt: new Date().toISOString(),
              // updatedAt: new Date().toISOString(),
              role: "user",
              content: "query",
              config: {
                // content: query,
                source: "user",
              },
              threadId: "1",
            },
          ],
        },
      });

      // Initialize run state BEFORE websocket connection
      setCurrentRun({
        // id: .,
        created_at: new Date().toISOString(),
        status: "created", // Start with created status
        messages: [],
        task: {
          content: query,
          source: "user",
        },
        team_result: null,
        error_message: undefined,
      });

      // Setup WebSocket
      // const socket = setupWebSocket(runId, query);
      // setActiveSocket(socket);
      // activeSocketRef.current = socket;
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = (runId: string, query: string): WebSocket => {
    if (!session || !session.metadata.id) {
      throw new Error("Invalid session configuration");
    }
    // Close existing socket if any
    if (activeSocket?.readyState === WebSocket.OPEN) {
      activeSocket.close();
    }

    // const baseUrl = getBaseUrl(serverUrl);
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//api/ws/runs/${runId}`;

    const socket = new WebSocket(wsUrl);

    // Initialize current run
    setCurrentRun({
      id: runId,
      created_at: new Date().toISOString(),
      status: "active",
      task: createMessage(
        { content: query, source: "user" },
        runId,
        session.metadata.id,
      ).config,
      team_result: null,
      messages: [],
      error_message: undefined,
    });

    socket.onopen = () => {
      // Send start message with teamConfig
      socket.send(
        JSON.stringify({
          type: "start",
          task: query,
          team_config: teamConfigQuery.data,
        }),
      );
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      } catch (error) {
        console.error("WebSocket message parsing error:", error);
      }
    };

    socket.onclose = () => {
      activeSocketRef.current = null;
      setActiveSocket(null);
    };

    socket.onerror = (error) => {
      handleError(error);
    };

    return socket;
  };

  // Helper for WebSocket URL
  // const getBaseUrl = (url: string): string => {
  //   try {
  //     let baseUrl = url.replace(/(^\w+:|^)\/\//, "");
  //     if (baseUrl.startsWith("localhost")) {
  //       baseUrl = baseUrl.replace("/api", "");
  //     } else if (baseUrl === "/api") {
  //       baseUrl = window.location.host;
  //     } else {
  //       baseUrl = baseUrl.replace("/api", "").replace(/\/$/, "");
  //     }
  //     return baseUrl;
  //   } catch (error) {
  //     console.error("Error processing server URL:", error);
  //     throw new Error("Invalid server URL configuration");
  //   }
  // };

  return (
    <div className="text-primary h-[calc(100vh-165px)] relative rounded flex-1 scroll">
      <DebugValue data={{ team: teamConfigQuery.data }} />
      {/* {contextHolder} */}
      <div className="flex pt-2 items-center gap-2  text-sm">
        <span className="text-primary font-medium"> Sessions</span>
        {session && (
          <>
            <ChevronRight className="w-4 h-4  " />
            <span className="">{session.name}</span>
          </>
        )}
      </div>
      <div className="flex flex-col h-full">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto scroll mt-2 min-h-0 relative"
        >
          <div id="scroll-gradient" className="scroll-gradient h-8 top-0">
            <span className="inline-block h-6" />
          </div>
          <>
            {teamConfigQuery.data && (
              <>
                {/* Existing Runs */}
                {existingRuns.map((run, index) => (
                  <RunView
                    teamConfig={teamConfigQuery.data}
                    key={`${run.id}-review-${index}`}
                    run={run}
                    isFirstRun={index === 0}
                  />
                ))}

                {/* Current Run */}
                {currentRun && (
                  <RunView
                    run={currentRun}
                    teamConfig={teamConfigQuery.data}
                    onInputResponse={handleInputResponse}
                    onCancel={handleCancel}
                    isFirstRun={existingRuns.length === 0}
                  />
                )}

                {/* No existing runs */}

                {!currentRun && existingRuns.length === 0 && (
                  <div className="flex items-center justify-center h-[80%]">
                    <div className="text-center">
                      <MessagesSquare
                        strokeWidth={1}
                        className="w-64 h-64 mb-4 inline-block"
                      />
                      <div className="  font-medium mb-2">Start a new task</div>
                      <div className="text-sm">Enter a task to get started</div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* No team config */}
            {!teamConfigQuery.data && (
              <div className="flex items-center justify-center h-[80%]">
                <div className="text-center  ">
                  <MessagesSquare
                    strokeWidth={1}
                    className="w-64 h-64 mb-4 inline-block"
                  />
                  <div className="  font-medium mb-2">
                    No team configuration found for this session (may have been
                    deleted).{" "}
                  </div>
                  <div className="text-sm">
                    Add a team to the session to get started.
                  </div>
                </div>
              </div>
            )}
          </>
        </div>

        {session && teamConfigQuery.data && (
          <div className="flex-shrink-0">
            <ChatInput
              onSubmit={runTask}
              loading={loading}
              error={error}
              disabled={currentRun?.status === "awaiting_input"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
