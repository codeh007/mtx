"use client";

import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";

import { AssistantLoader } from "mtmaiui/components/chat/AssistantLoader";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { SkeletonLoading } from "mtxuilib/components/skeletons/SkeletonLoading";
import { Suspense } from "react";
export default function ChatLayout(props: {
  children: React.ReactNode;
  params: { chatProfileId: string };
}) {
  const { children, params } = props;
  const { chatProfileId } = params;

  return (
    <MtSuspenseBoundary>
      <Suspense fallback={<SkeletonLoading />}>
        <DashSidebar chatProfileId={chatProfileId} />
        <SidebarInset>
          <AssistantLoader>
            <div className="w-full flex h-full">
              {/* <ChatPanel /> */}
              {/* <WorkbenchWrapper>{children}</WorkbenchWrapper> */}
            </div>
          </AssistantLoader>
        </SidebarInset>
      </Suspense>
    </MtSuspenseBoundary>
  );
}
