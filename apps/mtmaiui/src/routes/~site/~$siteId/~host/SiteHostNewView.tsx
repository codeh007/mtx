"use client";

import { useMutation } from "@tanstack/react-query";
import { siteHostCreateMutation } from "mtmaiapi";
import { zUpdateSiteHostRequest } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "mtxuilib/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";

interface SiteHostCreateDialogProps {
  siteId: string;
  tid: string;
}

export function SiteHostCreateDialog({ siteId, tid }: SiteHostCreateDialogProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent>
        <SiteHostNewView siteId={siteId} tid={tid} />
      </DialogContent>
    </Dialog>
  );
}

interface SiteHostNewViewProps {
  siteId: string;
  tid: string;
}
export function SiteHostNewView({ siteId, tid }: SiteHostNewViewProps) {
  const siteHostCreate = useMutation({
    ...siteHostCreateMutation(),
  });
  const handleSubmit = (values) => {
    console.log("submit form", values);
    siteHostCreate.mutate({
      path: {
        tenant: tid,
      },
      body: {
        ...values,
        siteId: siteId,
      },
    });
  };

  const zform = useZodFormV2({
    schema: zUpdateSiteHostRequest,
    handleSubmit,
  });
  return (
    <ZForm {...zform} handleSubmit={handleSubmit}>
      <div className="p-8">
        create site host
        <FormField
          control={zform.form.control}
          name="host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>input</FormLabel>
              <FormControl>
                <Input placeholder="域名" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <ZFormToolbar form={zform.form} />
      </div>
    </ZForm>
  );
}
