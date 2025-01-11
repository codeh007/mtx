import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "mtxuilib/lib/utils";
import { Spinner } from "mtxuilib/mt/mtloading";
import { Button } from "mtxuilib/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "mtxuilib/ui/dialog";
import { Textarea } from "mtxuilib/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  emails: z.array(z.string().email()).min(1).max(100),
});

interface CreateEmailGroupDialogProps {
  className?: string;
  onSubmit: (opts: z.infer<typeof schema>) => void;
  isLoading: boolean;
  fieldErrors?: Record<string, string>;
}

export function CreateEmailGroupDialog({
  className,
  ...props
}: CreateEmailGroupDialogProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const emailsError =
    errors.emails?.message?.toString() || props.fieldErrors?.name;

  return (
    <DialogContent className="w-fit max-w-[80%] min-w-[500px]">
      <DialogHeader>
        <DialogTitle>Create an email group</DialogTitle>
        <DialogDescription className="py-2">
          Enter emails as a comma-separated list.
        </DialogDescription>
      </DialogHeader>
      <div className={cn("grid gap-6", className)}>
        <form
          onSubmit={handleSubmit((d) => {
            props.onSubmit(d);
          })}
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              {/* <Label htmlFor="emails">Emails</Label> */}
              <Controller
                control={control}
                name="emails"
                render={({ field }) => {
                  return (
                    <Textarea
                      id="api-token-name"
                      placeholder="email1@example.com,email2@example.com"
                      onChange={(e) => {
                        field.onChange(e.target.value.split(","));
                      }}
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={props.isLoading}
                    />
                  );
                }}
              />
              {emailsError && (
                <div className="text-sm text-red-500">{emailsError}</div>
              )}
            </div>
            <Button disabled={props.isLoading}>
              {props.isLoading && <Spinner />}
              Create email group
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
