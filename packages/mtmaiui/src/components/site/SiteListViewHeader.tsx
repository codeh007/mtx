"use client";

import { ZForm, useZodForm } from "mtxuilib/form/ZodForm";
import { Icons } from "mtxuilib/icons/icons";
import { Button } from "mtxuilib/ui/button";
import { Input } from "mtxuilib/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
import { useBasePath } from "../../hooks/useBasePath";
import { CustomLink } from "../CustomLink";

export const SiteListViewHeader = () => {
  const form = useZodForm({
    schema: z.any(),
    defaultValues: {},
  });

  const handleSearch = () => {
    form.handleSubmit((values) => {
      console.log(values);
    })();
  };

  const debouncedSearch = useDebouncedCallback(handleSearch, 500);
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      debouncedSearch();
    });
    return () => subscription.unsubscribe();
  }, [form.watch, debouncedSearch]);

  const basePath = useBasePath();
  return (
    <ZForm
      form={form}
      className="flex items-center space-x-2 p-1 justify-center"
      handleSubmit={handleSearch}
    >
      <div className="flex-1">
        <Input type="q" placeholder="search..." {...form.register("q")} />
      </div>
      <div className="flex items-center justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <CustomLink
              to={`${basePath}/site/create`}
              className="w-8 h-8 rounded-full p-1"
            >
              <Button variant={"outline"} className="rounded-full" size="icon">
                <Icons.plus className="size-4" />
              </Button>
            </CustomLink>
          </TooltipTrigger>
          <TooltipContent side="bottom">new</TooltipContent>
        </Tooltip>
      </div>
    </ZForm>
  );
};
