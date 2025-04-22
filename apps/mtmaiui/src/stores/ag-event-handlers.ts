"use client";

import type { AdkRawEvent } from "mtmaiapi";
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
      const adkRawEvent = get().adkRawEvents.find(
        (item) => item.invocation_id === event.invocation_id,
      );
      if (adkRawEvent) {
        // 更新现有事件的内容，合并之前的消息内容
        set({
          adkRawEvents: get().adkRawEvents.map((item) => {
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
        set({
          adkRawEvents: [...get().adkRawEvents, event],
        });
      }
    } else {
      // 完整消息
      const adkRawEvent = get().adkRawEvents.find(
        (item) => item.invocation_id === event.invocation_id,
      );
      if (adkRawEvent) {
        // 更新为完整消息
        set({
          adkRawEvents: get().adkRawEvents.map((item) => {
            if (item.invocation_id === event.invocation_id) {
              return event;
            }
            return item;
          }),
        });
      } else {
        // 添加新的完整消息
        set({
          adkRawEvents: [...get().adkRawEvents, event],
        });
      }
    }

    //   if (adkRawEvent) {
    //     // 更新 adkRawEvent 的 content
    //     adkRawEvent.content = {
    //       ...adkRawEvent.content,
    //       role: event.content.role,
    //       parts: [...(adkRawEvent.content?.parts ?? []), ...event.content.parts],
    //     };
    //   } else {
    //     set({
    //       adkRawEvents: [
    //         ...get().adkRawEvents,
    //         {
    //           ...event,
    //           invocation_id: event.invocation_id,
    //         },
    //       ],
    //     });
    //   }
  }
};
