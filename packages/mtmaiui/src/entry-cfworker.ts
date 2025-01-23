export { WfHelloAssisant } from "mtxuilib/workflows/hello-assisant.ts";
export { WfHelloToolUse } from "mtxuilib/workflows/hello-tooluse.ts";
export { MyWorkflow } from "mtxuilib/workflows/hello-workflow.ts";
export { WorkflowDemo } from "mtxuilib/workflows/WorkflowDemo.ts";
import { handleWsRequest } from "mtxuilib/routes/ws/wsApp.ts";

import { mainApp } from "mtxuilib/routes/edgeApi.ts";

export default {
  async fetch(request: Request, env, ctx) {
    const uri = new URL(request.url);
    if (uri.pathname.startsWith("/api/ws")) {
      return handleWsRequest(request, env, ctx);
    }
    return mainApp.fetch(request, env, ctx);
  },
};
