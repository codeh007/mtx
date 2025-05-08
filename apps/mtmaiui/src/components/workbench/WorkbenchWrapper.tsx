"use client";

import { cn } from "mtxuilib/lib/utils";

import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { memo } from "react";
import { useWorkbenchStore } from "../../stores/workbrench.store";
import { RemotionNextDemo1 } from "../remotion/RemotionNextDemo1";

export const WorkbenchWrapper = memo(function WorkbenchWrapper(props: {
  children: React.ReactNode;
}) {
  const { children } = props;

  const showWorkbench = useWorkbenchStore((x) => x.openWorkbench);
  const setOpenWorkbench = useWorkbenchStore((x) => x.setOpenWorkbench);
  return (
    <div className={cn("flex h-full")}>
      {/* 左侧(聊天面板) */}
      <div className="w-full">{children}</div>
      {/* 右侧面板(主体内容) */}
      <WorkbenchContent />
    </div>
  );
});

export const WorkbenchContent = () => {
  const activeArtiface = useWorkbenchStore((x) => x.activeArtiface);
  const setActiveArtiface = useWorkbenchStore((x) => x.setActiveArtiface);
  return (
    <div className="w-full bg-slate-100">
      {!activeArtiface && (
        <div>
          <RemotionNextDemo1 title={"一些文字333"} />{" "}
        </div>
      )}
      {(activeArtiface as any) && (
        <div>
          <DebugValue data={activeArtiface} />
        </div>
      )}
    </div>
  );
};
