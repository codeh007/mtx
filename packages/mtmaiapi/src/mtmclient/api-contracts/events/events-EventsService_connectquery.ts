// @generated by protoc-gen-connect-query v2.0.1 with parameter "target=ts,import_extension=none,ts_nocheck=true"
// @generated from file api-contracts/events/events.proto (syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { EventsService } from "./events_pb";

/**
 * @generated from rpc EventsService.Push
 */
export const push = EventsService.method.push;

/**
 * @generated from rpc EventsService.BulkPush
 */
export const bulkPush = EventsService.method.bulkPush;

/**
 * @generated from rpc EventsService.ReplaySingleEvent
 */
export const replaySingleEvent = EventsService.method.replaySingleEvent;

/**
 * @generated from rpc EventsService.PutLog
 */
export const putLog = EventsService.method.putLog;

/**
 * @generated from rpc EventsService.PutStreamEvent
 */
export const putStreamEvent = EventsService.method.putStreamEvent;