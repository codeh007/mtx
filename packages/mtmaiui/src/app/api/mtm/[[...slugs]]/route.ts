import { Hono } from "hono";
import { mainApp } from "mtxuilib/routes/edgeApi";

export const runtime = "edge";
const pathPrefix = "/api/mtm";

const handler = new Hono().mount(pathPrefix, mainApp.fetch).fetch;

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
