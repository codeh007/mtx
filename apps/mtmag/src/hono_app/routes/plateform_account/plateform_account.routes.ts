import { createRoute, z } from "@hono/zod-openapi";

import {
  UserSelectSchema,
  createErrorSchema,
  createMessageObjectSchema,
  idParamsSchema,
  patchUserSchema,
} from "../../schemas";
import { PlateformAccountInsertSchema, PlateformAccountSelectSchema } from "./schema";

const tags = ["PlateformAccount"];

export const list = createRoute({
  operationId: "listPlateformAccount",
  path: "/plateform_account",
  method: "get",
  tags,
  "x-speakeasy-retries": {
    strategy: "backoff",
    backoff: {
      initialInterval: 300,
      maxInterval: 40000,
      maxElapsedTime: 3000000,
      exponent: 1.2,
    },
    statusCodes: ["5XX"],
    retryConnectionErrors: true,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(PlateformAccountSelectSchema),
        },
      },
      description: "The list of plateform accounts",
    },
  },
});

export const create = createRoute({
  operationId: "createPlateformAccount",
  path: "/plateform_account",
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: PlateformAccountInsertSchema,
        },
      },
      description: "The plateform account to create",
      required: true,
    },
  },
  tags,
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UserSelectSchema,
        },
      },
      description: "The created user",
    },
    404: {
      content: {
        "application/json": {
          schema: createMessageObjectSchema("Not Found"),
        },
      },
      description: "User not found",
    },
    422: {
      content: {
        "application/json": {
          schema: createErrorSchema(patchUserSchema),
        },
      },
      description: "The validation error(s)",
    },
  },
});

export const getOne = createRoute({
  operationId: "getPlateformAccount",
  path: "/plateform_account/{id}",
  method: "get",
  request: {
    params: idParamsSchema,
  },
  tags,
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UserSelectSchema,
        },
      },
      description: "The requested user",
    },
    404: {
      content: {
        "application/json": {
          schema: createMessageObjectSchema("Not Found"),
        },
      },
      description: "User not found",
    },
    422: {
      content: {
        "application/json": {
          schema: createErrorSchema(patchUserSchema),
        },
      },
      description: "Invalid id error",
    },
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
