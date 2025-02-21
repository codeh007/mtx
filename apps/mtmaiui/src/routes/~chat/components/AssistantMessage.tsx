import { MessagePrimitive } from "@assistant-ui/react";

import { Avatar, AvatarFallback } from "mtxuilib/ui/avatar";
export const AssistantMessage = () => {
  return (
    <MessagePrimitive.Root className="relative flex w-full max-w-2xl gap-3 pb-12">
      <Avatar>
        <AvatarFallback>A</AvatarFallback>
      </Avatar>

      <div className="flex-grow">
        <p className="font-semibold">Assistant</p>

        <p className="whitespace-pre-line text-foreground">
          <MessagePrimitive.Content />
        </p>
      </div>
    </MessagePrimitive.Root>
  );
};
