"use client";

import type { Reflections, CustomQuickAction } from "mtmaiapi";
import { useToast } from "mtxuilib/ui/use-toast";
import { useState } from "react";

// use by opencanvas
export function useStore() {
  const { toast } = useToast();
  const [isLoadingReflections, setIsLoadingReflections] = useState(false);
  const [isLoadingQuickActions, setIsLoadingQuickActions] = useState(false);
  const [reflections, setReflections] = useState<
    Reflections & { assistantId: string; updatedAt: Date }
  >();

  const getReflections = async (assistantId: string): Promise<void> => {
    setIsLoadingReflections(true);
    const res = await fetch("/api/store/get", {
      method: "POST",
      body: JSON.stringify({
        namespace: ["memories", assistantId],
        key: "reflection",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return;
    }

    const { item } = await res.json();

    if (!item?.value) {
      setIsLoadingReflections(false);
      // No reflections found. Return early.
      setReflections(undefined);
      return;
    }

    let styleRules = item.value.styleRules ?? [];
    let content = item.value.content ?? [];
    try {
      styleRules =
        typeof styleRules === "string" ? JSON.parse(styleRules) : styleRules;
      content = typeof content === "string" ? JSON.parse(content) : content;
    } catch (e) {
      console.error("Failed to parse reflections", e);
      styleRules = [];
      content = [];
    }

    setReflections({
      ...item.value,
      styleRules,
      content,
      updatedAt: new Date(item.updatedAt),
      assistantId,
    });
    setIsLoadingReflections(false);
  };

  const deleteReflections = async (assistantId: string): Promise<boolean> => {
    const res = await fetch("/api/store/delete", {
      method: "POST",
      body: JSON.stringify({
        namespace: ["memories", assistantId],
        key: "reflection",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return false;
    }

    const { success } = await res.json();
    if (success) {
      setReflections(undefined);
    } else {
      toast({
        title: "Failed to delete reflections",
        description: "Please try again later.",
      });
    }
    return success;
  };

  const getCustomQuickActions = async (
    userId: string,
  ): Promise<CustomQuickAction[] | undefined> => {
    setIsLoadingQuickActions(true);
    try {
      const res = await fetch("/api/store/get", {
        method: "POST",
        body: JSON.stringify({
          namespace: ["custom_actions", userId],
          key: "actions",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        return undefined;
      }

      const { item } = await res.json();
      if (!item?.value) {
        return undefined;
      }
      return Object.values(item?.value);
    } finally {
      setIsLoadingQuickActions(false);
    }
  };

  const deleteCustomQuickAction = async (
    id: string,
    rest: CustomQuickAction[],
    userId: string,
  ): Promise<boolean> => {
    const valuesWithoutDeleted = rest.reduce<Record<string, CustomQuickAction>>(
      (acc, action) => {
        if (action.id !== id) {
          acc[action.id] = action;
        }
        return acc;
      },
      {},
    );

    const res = await fetch("/api/store/put", {
      method: "POST",
      body: JSON.stringify({
        namespace: ["custom_actions", userId],
        key: "actions",
        value: valuesWithoutDeleted,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return false;
    }

    const { success } = await res.json();
    return success;
  };

  const createCustomQuickAction = async (
    newAction: CustomQuickAction,
    rest: CustomQuickAction[],
    userId: string,
  ): Promise<boolean> => {
    const newValue = rest.reduce<Record<string, CustomQuickAction>>(
      (acc, action) => {
        acc[action.id] = action;
        return acc;
      },
      {},
    );

    newValue[newAction.id] = newAction;
    const res = await fetch("/api/store/put", {
      method: "POST",
      body: JSON.stringify({
        namespace: ["custom_actions", userId],
        key: "actions",
        value: newValue,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return false;
    }

    const { success } = await res.json();
    return success;
  };

  const editCustomQuickAction = async (
    editedAction: CustomQuickAction,
    rest: CustomQuickAction[],
    userId: string,
  ): Promise<boolean> => {
    const newValue = rest.reduce<Record<string, CustomQuickAction>>(
      (acc, action) => {
        acc[action.id] = action;
        return acc;
      },
      {},
    );

    newValue[editedAction.id] = editedAction;
    const res = await fetch("/api/store/put", {
      method: "POST",
      body: JSON.stringify({
        namespace: ["custom_actions", userId],
        key: "actions",
        value: newValue,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return false;
    }

    const { success } = await res.json();
    return success;
  };

  return {
    isLoadingReflections,
    reflections,
    isLoadingQuickActions,
    deleteReflections,
    getReflections,
    deleteCustomQuickAction,
    getCustomQuickActions,
    editCustomQuickAction,
    createCustomQuickAction,
  };
}
