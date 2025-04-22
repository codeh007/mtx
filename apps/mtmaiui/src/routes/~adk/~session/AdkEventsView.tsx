"use client";

import { useQuery } from "@tanstack/react-query";
import { type AdkEvent, type Content, type Part, adkEventsListOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTenantId } from "../../../hooks/useAuth";

interface AdkEventsViewProps {
  sessionId: string;
}
export const AdkEventsView = ({ sessionId }: AdkEventsViewProps) => {
  const tid = useTenantId();
  const adkStateQuery = useQuery({
    ...adkEventsListOptions({
      path: {
        tenant: tid,
      },
      query: {
        session: sessionId,
      },
    }),
  });

  return (
    <div className=" rounded-md p-2  space-y-1">
      {/* <DebugValue data={{ data: adkStateQuery.data }} /> */}
      {adkStateQuery.data?.rows?.map((item) => {
        return <AdkEventsViewItemView key={item.id} item={item} />;
      })}
    </div>
  );
};

export const AdkEventsViewItemView = ({
  item,
}: {
  item: AdkEvent;
}) => {
  return (
    <div className="border border-gray-100 rounded-md p-2 bg-blue-100">
      event item
      <DebugValue data={item} />
      {item.content && <AdkContentView content={item.content} />}
    </div>
  );
};

export const AdkContentView = ({
  content,
}: {
  content: Content;
}) => {
  return (
    <div>
      {content.parts?.map((part, i) => {
        return <AdkContentPartView key={i} part={part} />;
      })}
    </div>
  );
};

export const AdkContentPartView = ({
  part,
}: {
  part: Part;
}) => {
  return <div>{part.text}</div>;
};
