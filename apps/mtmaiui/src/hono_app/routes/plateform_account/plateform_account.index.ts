import { createRouter } from "../agent_api/lib/createApp";

import * as handlers from "./plateform_account.handlers";
import * as routes from "./plateform_account.routes";

const router = createRouter()
  .basePath("/api")
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne);

export default router;
