export { WfHelloAssisant } from "mtxuilib/workflows/hello-assisant";
export { WfHelloToolUse } from "mtxuilib/workflows/hello-tooluse";
export { MyWorkflow } from "mtxuilib/workflows/hello-workflow";
export { WorkflowDemo } from "mtxuilib/workflows/WorkflowDemo";
import { handleWsRequest } from "mtxuilib/routes/ws/wsApp";

import { mainApp } from "mtxuilib/routes/edgeApi";

export default {
  async fetch(request: Request, env, ctx) {
    const uri = new URL(request.url);
    if (uri.pathname.startsWith("/api/ws")) {
      return handleWsRequest(request, env, ctx);
    }
    return mainApp.fetch(request, env, ctx);
  },
};
