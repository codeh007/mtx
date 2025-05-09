// @generated by protoc-gen-es v2.2.5 with parameter "target=ts"
// @generated from file mtmai/mtmpb/git.proto (package mtmai.mtmpb.git, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc, serviceDesc } from "@bufbuild/protobuf/codegenv1";
import { file_mtmai_mtmpb_mtm } from "./mtm_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file mtmai/mtmpb/git.proto.
 */
export const file_mtmai_mtmpb_git: GenFile =
  /*@__PURE__*/
  fileDesc(
    "ChVtdG1haS9tdG1wYi9naXQucHJvdG8SD210bWFpLm10bXBiLmdpdCIYCgpHaXRQdWxsUmVxEgoKAmlkGAEgASgJIhkKC0dpdFNldHVwUmVxEgoKAmlkGAEgASgJIg0KC0dpdFNldHVwUmVzIgwKCkdpdFB1bGxSZXMiGgoJR2l0R2V0UmVxEg0KBXNsdWdzGAEgASgJIhUKB0dpdEluZm8SCgoCaWQYASABKAkiGQoLR2l0U3RhcnRSZXESCgoCaWQYASABKAkiDQoLR2l0U3RhcnRSZXMiGAoKR2l0U3RvcFJlcRIKCgJpZBgBIAEoCSIMCgpHaXRTdG9wUmVzMvACCgpHaXRTZXJ2aWNlEkAKBkdpdEdldBIaLm10bWFpLm10bXBiLmdpdC5HaXRHZXRSZXEaGC5tdG1haS5tdG1wYi5naXQuR2l0SW5mbyIAEkUKB0dpdFB1bGwSGy5tdG1haS5tdG1wYi5naXQuR2l0UHVsbFJlcRobLm10bWFpLm10bXBiLmdpdC5HaXRQdWxsUmVzIgASSAoIR2l0U2V0dXASHC5tdG1haS5tdG1wYi5naXQuR2l0U2V0dXBSZXEaHC5tdG1haS5tdG1wYi5naXQuR2l0U2V0dXBSZXMiABJICghHaXRTdGFydBIcLm10bWFpLm10bXBiLmdpdC5HaXRTdGFydFJlcRocLm10bWFpLm10bXBiLmdpdC5HaXRTdGFydFJlcyIAEkUKB0dpdFN0b3ASGy5tdG1haS5tdG1wYi5naXQuR2l0U3RvcFJlcRobLm10bWFpLm10bXBiLmdpdC5HaXRTdG9wUmVzIgBCswEKE2NvbS5tdG1haS5tdG1wYi5naXRCCEdpdFByb3RvUAFaNGdpdGh1Yi5jb20vY29kZWgwMDcvZ29tdG0vbXRtL3NwcGIvbXRtYWkvbXRtcGI7bXRtcGKiAgNNTUeqAg9NdG1haS5NdG1wYi5HaXTKAg9NdG1haVxNdG1wYlxHaXTiAhtNdG1haVxNdG1wYlxHaXRcR1BCTWV0YWRhdGHqAhFNdG1haTo6TXRtcGI6OkdpdGIGcHJvdG8z",
    [file_mtmai_mtmpb_mtm],
  );

/**
 * @generated from message mtmai.mtmpb.git.GitPullReq
 */
export type GitPullReq = Message<"mtmai.mtmpb.git.GitPullReq"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
};

/**
 * Describes the message mtmai.mtmpb.git.GitPullReq.
 * Use `create(GitPullReqSchema)` to create a new message.
 */
export const GitPullReqSchema: GenMessage<GitPullReq> =
  /*@__PURE__*/
  messageDesc(file_mtmai_mtmpb_git, 0);

/**
 * @generated from message mtmai.mtmpb.git.GitSetupReq
 */
export type GitSetupReq = Message<"mtmai.mtmpb.git.GitSetupReq"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
};

/**
 * Describes the message mtmai.mtmpb.git.GitSetupReq.
 * Use `create(GitSetupReqSchema)` to create a new message.
 */
export const GitSetupReqSchema: GenMessage<GitSetupReq> =
  /*@__PURE__*/
  messageDesc(file_mtmai_mtmpb_git, 1);

/**
 * @generated from message mtmai.mtmpb.git.GitSetupRes
 */
export type GitSetupRes = Message<"mtmai.mtmpb.git.GitSetupRes"> & {};

/**
 * Describes the message mtmai.mtmpb.git.GitSetupRes.
 * Use `create(GitSetupResSchema)` to create a new message.
 */
export const GitSetupResSchema: GenMessage<GitSetupRes> =
  /*@__PURE__*/
  messageDesc(file_mtmai_mtmpb_git, 2);

/**
 * @generated from message mtmai.mtmpb.git.GitPullRes
 */
export type GitPullRes = Message<"mtmai.mtmpb.git.GitPullRes"> & {};

/**
 * Describes the message mtmai.mtmpb.git.GitPullRes.
 * Use `create(GitPullResSchema)` to create a new message.
 */
export const GitPullResSchema: GenMessage<GitPullRes> =
  /*@__PURE__*/
  messageDesc(file_mtmai_mtmpb_git, 3);

/**
 * @generated from message mtmai.mtmpb.git.GitGetReq
 */
export type GitGetReq = Message<"mtmai.mtmpb.git.GitGetReq"> & {
  /**
   * @generated from field: string slugs = 1;
   */
  slugs: string;
};

/**
 * Describes the message mtmai.mtmpb.git.GitGetReq.
 * Use `create(GitGetReqSchema)` to create a new message.
 */
export const GitGetReqSchema: GenMessage<GitGetReq> =
  /*@__PURE__*/
  messageDesc(file_mtmai_mtmpb_git, 4);

/**
 * @generated from message mtmai.mtmpb.git.GitInfo
 */
export type GitInfo = Message<"mtmai.mtmpb.git.GitInfo"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
};

/**
 * Describes the message mtmai.mtmpb.git.GitInfo.
 * Use `create(GitInfoSchema)` to create a new message.
 */
export const GitInfoSchema: GenMessage<GitInfo> =
  /*@__PURE__*/
  messageDesc(file_mtmai_mtmpb_git, 5);

/**
 * @generated from message mtmai.mtmpb.git.GitStartReq
 */
export type GitStartReq = Message<"mtmai.mtmpb.git.GitStartReq"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
};

/**
 * Describes the message mtmai.mtmpb.git.GitStartReq.
 * Use `create(GitStartReqSchema)` to create a new message.
 */
export const GitStartReqSchema: GenMessage<GitStartReq> =
  /*@__PURE__*/
  messageDesc(file_mtmai_mtmpb_git, 6);

/**
 * @generated from message mtmai.mtmpb.git.GitStartRes
 */
export type GitStartRes = Message<"mtmai.mtmpb.git.GitStartRes"> & {};

/**
 * Describes the message mtmai.mtmpb.git.GitStartRes.
 * Use `create(GitStartResSchema)` to create a new message.
 */
export const GitStartResSchema: GenMessage<GitStartRes> =
  /*@__PURE__*/
  messageDesc(file_mtmai_mtmpb_git, 7);

/**
 * @generated from message mtmai.mtmpb.git.GitStopReq
 */
export type GitStopReq = Message<"mtmai.mtmpb.git.GitStopReq"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
};

/**
 * Describes the message mtmai.mtmpb.git.GitStopReq.
 * Use `create(GitStopReqSchema)` to create a new message.
 */
export const GitStopReqSchema: GenMessage<GitStopReq> =
  /*@__PURE__*/
  messageDesc(file_mtmai_mtmpb_git, 8);

/**
 * @generated from message mtmai.mtmpb.git.GitStopRes
 */
export type GitStopRes = Message<"mtmai.mtmpb.git.GitStopRes"> & {};

/**
 * Describes the message mtmai.mtmpb.git.GitStopRes.
 * Use `create(GitStopResSchema)` to create a new message.
 */
export const GitStopResSchema: GenMessage<GitStopRes> =
  /*@__PURE__*/
  messageDesc(file_mtmai_mtmpb_git, 9);

/**
 * @generated from service mtmai.mtmpb.git.GitService
 */
export const GitService: GenService<{
  /**
   * 列出git项目
   * rpc GitList(mtmai.mtm.sppb.CommontListReq)
   *     returns (mtmai.mtm.sppb.CommontListRes) {}
   *
   * @generated from rpc mtmai.mtmpb.git.GitService.GitGet
   */
  gitGet: {
    methodKind: "unary";
    input: typeof GitGetReqSchema;
    output: typeof GitInfoSchema;
  };
  /**
   * @generated from rpc mtmai.mtmpb.git.GitService.GitPull
   */
  gitPull: {
    methodKind: "unary";
    input: typeof GitPullReqSchema;
    output: typeof GitPullResSchema;
  };
  /**
   * @generated from rpc mtmai.mtmpb.git.GitService.GitSetup
   */
  gitSetup: {
    methodKind: "unary";
    input: typeof GitSetupReqSchema;
    output: typeof GitSetupResSchema;
  };
  /**
   * @generated from rpc mtmai.mtmpb.git.GitService.GitStart
   */
  gitStart: {
    methodKind: "unary";
    input: typeof GitStartReqSchema;
    output: typeof GitStartResSchema;
  };
  /**
   * @generated from rpc mtmai.mtmpb.git.GitService.GitStop
   */
  gitStop: {
    methodKind: "unary";
    input: typeof GitStopReqSchema;
    output: typeof GitStopResSchema;
  };
}> = /*@__PURE__*/ serviceDesc(file_mtmai_mtmpb_git, 0);
