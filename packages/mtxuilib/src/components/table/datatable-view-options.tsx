"use client";

import type { UseMutationResult } from "@tanstack/react-query";

interface ViewAction {
  label: string;
  link: string;
}

export interface DataViewOptions {
  listActions?: ViewAction[];
  rowActions?: ViewAction[];
  updateMutation?: UseMutationResult;
  //创建新记录的回调函数
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  createNewItem?: (input: any) => any;
  //编辑模式
  // togelEditMode: 'auto' | 'doubleclick' | 'none',
  // editDisplayMode: 'inline' | 'popup' | 'modal'
}
