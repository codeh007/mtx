import { MessagePrimitive } from "@assistant-ui/react";

import { Avatar, AvatarFallback } from "mtxuilib/ui/avatar";
export const UserMessage = () => {
  return (
    <MessagePrimitive.Root className="relative flex w-full max-w-2xl gap-3 pb-12">
      <Avatar>
        <AvatarFallback>Y</AvatarFallback>
      </Avatar>

      <div className="flex-grow">
        <p className="font-semibold">You</p>

        <p className="whitespace-pre-line text-foreground">
          <MessagePrimitive.Content />
        </p>
      </div>
    </MessagePrimitive.Root>
  );
};
