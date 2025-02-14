"use client";

import type { Thread } from "@langchain/langgraph-sdk";
import { client } from "mtmaiapi/gomtmapi/client.gen";

import {
  type ALL_MODEL_NAMES,
  DEFAULT_MODEL_NAME,
  HAS_EMPTY_THREADS_CLEARED_COOKIE,
} from "mtxuilib/constants";
import { getCookie, setCookie } from "mtxuilib/lib/clientlib";
import { useState } from "react";
import { createThread } from "../components/assistant-ui-stockbroker/chatApi";

export function useThread() {
  const [threadId, setThreadId] = useState<string>();
  const [userThreads, setUserThreads] = useState<Thread[]>([]);
  const [isUserThreadsLoading, setIsUserThreadsLoading] = useState(false);
  const [modelName, setModelName] =
    useState<ALL_MODEL_NAMES>(DEFAULT_MODEL_NAME);

  // const createThread = async (
  //   customModelName: ALL_MODEL_NAMES,
  //   userId: string,
  // ): Promise<Thread | undefined> => {
  //   try {
  //     const thread = await client.threads.create({
  //       metadata: {
  //         supabase_user_id: userId,
  //         customModelName,
  //       },
  //     });
  //     setThreadId(thread.thread_id);
  //     setCookie(THREAD_ID_COOKIE_NAME, thread.thread_id);
  //     setModelName(customModelName);
  //     await getUserThreads(userId);
  //     return thread;
  //   } catch (e) {
  //     console.error("Failed to create thread", e);
  //   }
  // };

  // const getUserThreads = async (userId: string) => {
  //   setIsUserThreadsLoading(true);
  //   try {
  //     const userThreads = await client.threads.search({
  //       metadata: {
  //         supabase_user_id: userId,
  //       },
  //       limit: 100,
  //     });

  //     if (userThreads?.length > 0) {
  //       const lastInArray = userThreads[0];
  //       const allButLast = userThreads.slice(1, userThreads.length);
  //       const filteredThreads = allButLast.filter(
  //         (thread) => thread.values && Object.keys(thread.values).length > 0,
  //       );
  //       setUserThreads([...filteredThreads, lastInArray]);
  //     }
  //   } finally {
  //     setIsUserThreadsLoading(false);
  //   }
  // };

  // const searchOrCreateThread = async (userId: string) => {
  //   const threadIdCookie = getCookie(THREAD_ID_COOKIE_NAME);
  //   if (!threadIdCookie) {
  //     await createThread(modelName, userId);
  //     return;
  //   }

  //   // Thread ID is in cookies.
  //   const thread = await getThreadById(threadIdCookie);
  //   if (
  //     thread &&
  //     (!thread?.values || Object.keys(thread.values).length === 0)
  //   ) {
  //     // No values = no activity. Can keep.
  //     setThreadId(threadIdCookie);
  //     return threadIdCookie;
  //   }
  //   // Current thread has activity. Create a new thread.
  //   await createThread(modelName, userId);
  //   return;
  // };

  const clearThreadsWithNoValues = async (userId: string) => {
    const hasBeenClearedCookie = getCookie(HAS_EMPTY_THREADS_CLEARED_COOKIE);
    if (hasBeenClearedCookie === "true") {
      return;
    }

    // const client = createClient();
    const processedThreadIds = new Set<string>();

    const fetchAndDeleteThreads = async (offset = 0) => {
      const userThreads = await client.threads?.search({
        metadata: {
          supabase_user_id: userId,
        },
        limit: 100,
        offset: offset,
      });

      const threadsToDelete = userThreads.filter(
        (thread) =>
          !thread.values &&
          thread.thread_id !== threadId &&
          !processedThreadIds.has(thread.thread_id),
      );

      if (threadsToDelete.length > 0) {
        const deleteBatch = async (threadIds: string[]) => {
          await Promise.all(
            threadIds.map(async (threadId) => {
              await client.threads.delete(threadId);
              processedThreadIds.add(threadId);
            }),
          );
        };

        // Create an array of unique thread IDs
        const uniqueThreadIds = Array.from(
          new Set(threadsToDelete.map((thread) => thread.thread_id)),
        );

        // Process unique thread IDs in batches of 10
        for (let i = 0; i < uniqueThreadIds.length; i += 10) {
          try {
            await deleteBatch(uniqueThreadIds.slice(i, i + 10));
          } catch (e) {
            console.error("Error deleting threads", e);
          }
        }
      }

      if (userThreads.length === 100) {
        // If we got 100 threads, there might be more, so continue fetching
        await fetchAndDeleteThreads(offset + 100);
      }
    };

    try {
      await fetchAndDeleteThreads();
      setCookie(HAS_EMPTY_THREADS_CLEARED_COOKIE, "true");
    } catch (e) {
      console.error("Error fetching & deleting threads", e);
    }
  };

  const getThreadById = async (id: string): Promise<Thread | undefined> => {
    try {
      const thread = await client.threads.get(id);
      if (thread.metadata?.customModelName) {
        setModelName(thread.metadata.customModelName as ALL_MODEL_NAMES);
      }
      return thread;
    } catch (e) {
      console.error(`Failed to get thread with ID ${id}`, e);
    }
  };

  const deleteThread = async (
    id: string,
    userId: string,
    clearMessages: () => void,
  ) => {
    setUserThreads((prevThreads) => {
      const newThreads = prevThreads.filter(
        (thread) => thread.thread_id !== id,
      );
      return newThreads;
    });
    if (id === threadId) {
      clearMessages();
      // Create a new thread. Use .then to avoid blocking the UI.
      // Once completed, `createThread` will re-fetch all user
      // threads to update UI.
      void createThread(modelName, userId);
    }
    // const client = createClient();
    try {
      await client.threads.delete(id);
    } catch (e) {
      console.error(`Failed to delete thread with ID ${id}`, e);
    }
  };

  return {
    threadId,
    userThreads,
    isUserThreadsLoading,
    modelName,
    createThread,
    clearThreadsWithNoValues,
    // searchOrCreateThread,
    // getUserThreads,
    deleteThread,
    getThreadById,
    setThreadId,
    setModelName,
  };
}
