import { handle } from "hono/vercel";
import localApp from "../../../../hono_app/local.app";
// export const runtime = "edge";
export const GET = handle(localApp);
export const POST = handle(localApp);
export const PUT = handle(localApp);
export const DELETE = handle(localApp);
export const PATCH = handle(localApp);
