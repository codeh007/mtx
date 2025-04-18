"use client";
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { createStore } from "zustand/vanilla";
import { DashMenuTreeItem } from "./Slnt.z";
/*****************************************************************
 * selected layout node tree
 * 基于 nextjs useSelectedLayoutSegments 结构的布局树
 *
 * 通常用于表示 布局导航菜单的树状结构，用于 breadcrumb, tabs 的节点状态的表达。
 ****************************************************************/
export type SLNTProps = {
  menuNode?: DashMenuTreeItem;
};

export interface SlntState extends SLNTProps {}
type slntStore = ReturnType<typeof createModalStore>;

const createModalStore = (initProps?: Partial<SLNTProps>) => {
  return createStore<SlntState>()(
    immer((set, get) => ({
      ...initProps,
    })),
  );
};
export const slntContext = createContext<slntStore | null>(null);

type ModalProviderProps = React.PropsWithChildren<SLNTProps>;
export const MenuTreeProvider = (props: ModalProviderProps) => {
  const { children, ...etc } = props;
  const mystore = useMemo(() => createModalStore(etc), [etc]);
  return (
    <slntContext.Provider value={mystore}>{children}</slntContext.Provider>
  );
};

export const DEFAULT_USE_SHALLOW = true;

export function useMenuTreeStore(): SlntState;
export function useMenuTreeStore<T>(selector: (state: SlntState) => T): T;
export function useMenuTreeStore<T>(selector?: (state: SlntState) => T) {
  const store = useContext(slntContext);
  if (!store) return null;
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(
      store,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      DEFAULT_USE_SHALLOW ? useShallow(selector) : selector,
    );
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}
// 可能没用了。
/***********************************************************************
 * 仅允许放到 对应的layout.tsx 文件中，表示一个深度的节点数据。
 * 例子：
 *     /dash/layout.tsx 中使用<SlntTreeNode>{children}</SlntTreeNode>
 *         表示以/dash/layout.tsx 作为跟跟节点
 *     /dash/site/[siteId]/layout.tsx 中再添加 :
 *         <SlntTreeNode>{children}</SlntTreeNode> ，
 *         表示 以/dash/site/[siteId]/layout.tsx 作为二级节点。
 *
 * 这样的好处是，路由树的接口可以灵活根据实际布局表达，而不是常规的仅仅依赖于 url.pathname
 *
 * @param props
 * @returns
 **********************************************************************/
export const SlntTreeNode = (
  props: {
    treeData?: DashMenuTreeItem;
  } & PropsWithChildren,
) => {
  const { children, treeData } = props;
  const parentData = useMenuTreeStore((x) => x?.menuNode);
  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();
  const parent = parentData || treeData;
  if (!parent) {
    throw new Error("must within parentNodes or rootNodes ");
  }
  const currNode = useMemo(() => {
    const fined = parent.children?.find((x) => x.routeName == segment);
    console.log({ message: `(SlntTreeNode)${segment}`, fined, parent });
    return fined;
  }, [parent, segment]);

  return (
    <MenuTreeProvider menuNode={currNode}>
      {/* <DebugValue
        title="SlntTreeNode"
        data={{ segments, segment, currNode, parent }}
      /> */}
      {children}
    </MenuTreeProvider>
  );
};
