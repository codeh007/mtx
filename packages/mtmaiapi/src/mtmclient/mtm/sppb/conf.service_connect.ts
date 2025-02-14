// @generated by protoc-gen-connect-es v1.6.1 with parameter "target=ts,import_extension=none"
// @generated from file mtm/sppb/conf.service.proto (package sppb, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { GetWebAppConfigReq, GetWebAppConfigResponse } from "./conf.service_pb";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service sppb.ConfigService
 */
export const ConfigService = {
  typeName: "sppb.ConfigService",
  methods: {
    /**
     * @generated from rpc sppb.ConfigService.GetWebAppConfig
     */
    getWebAppConfig: {
      name: "GetWebAppConfig",
      I: GetWebAppConfigReq,
      O: GetWebAppConfigResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;
