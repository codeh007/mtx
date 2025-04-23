"use client";

import type { AdkRawEvent } from "mtmaiapi";
import { generateUUID } from "mtxuilib/lib/utils";
import type { WorkbrenchState } from "./workbrench.store";

export const handleAgentOutgoingEvent = (
  event: AdkRawEvent,
  get: () => WorkbrenchState,
  set: (
    partial: Partial<WorkbrenchState> | ((state: WorkbrenchState) => Partial<WorkbrenchState>),
  ) => void,
) => {
  if (event.content) {
    console.log("event.content", event.content);

    if (event.partial) {
      // 流式事件处理
      const adkEvent = get().adkEvents.find((item) => item.invocation_id === event.invocation_id);
      if (adkEvent) {
        // 更新现有事件的内容，合并之前的消息内容
        set({
          adkEvents: get().adkEvents.map((item) => {
            if (item.invocation_id === event.invocation_id) {
              return {
                ...item,
                content: {
                  ...event.content,
                  role: event.content!.role,
                  parts: [
                    {
                      text:
                        (item.content?.parts?.[0]?.text || "") + event.content?.parts?.[0]?.text,
                    },
                  ],
                },
              };
            }
            return item;
          }),
        });
      } else {
        // 添加新的流式事件
        // set({
        //   adkEvents: [...get().adkEvents, event],
        // });
        console.warn("TODO 添加新的流式事件", event);
      }
    } else {
      // 完整消息
      const adkEvent = get().adkEvents.find((item) => item.invocation_id === event.invocation_id);
      if (adkEvent) {
        // 更新为完整消息
        set({
          adkEvents: get().adkEvents.map((item) => {
            if (item.invocation_id === event.invocation_id) {
              return {
                ...item,
                ...(event.content && { content: event.content }),
              };
            }
            return item;
          }),
        });
      } else {
        // 添加新的完整消息
        set({
          adkEvents: [
            ...get().adkEvents,
            {
              //可能需要修正
              metadata: {
                id: generateUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              content: event.content,
              app_name: "root",
              user_id: get().tenant.metadata.id,
              session_id: get().sessionId ?? "",
              author: event.author,
              invocation_id: event.invocation_id,
              actions: event.actions,
              id: generateUUID(),
              timestamp: new Date().toISOString(),
            },
          ],
        });
        console.warn("TODO 添加新的完整消息222", event);
      }
    }
  }
};
