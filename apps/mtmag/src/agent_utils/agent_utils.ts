import type { AgentRunRequest } from "../agent_state/root_agent_state";

export async function callAgentRunner(workagentUrl: string, payload: AgentRunRequest) {
  const agentApiEndpoint = `${workagentUrl}/api/v1/run_sse_v2`;
  const response = await fetch(agentApiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({ prompt, session_id: sessionId }),
    body: JSON.stringify(payload),
  });
  const data = await response.text();
  return data;
}
