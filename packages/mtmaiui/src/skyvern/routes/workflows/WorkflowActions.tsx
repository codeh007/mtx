"use client";

import {
  CopyIcon,
  DotsHorizontalIcon,
  DownloadIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { useMtRouter } from "mtxuilib/hooks/use-router";
import { GarbageIcon } from "mtxuilib/icons/GarbageIcon";
import { Button } from "mtxuilib/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "mtxuilib/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "mtxuilib/ui/dropdown-menu";
import { toast } from "react-toastify";
import { stringify as convertToYAML } from "yaml";
import { convert } from "./editor/workflowEditorUtils";
import { useWorkflowQuery } from "./hooks/useWorkflowQuery";
import type { WorkflowApiResponse } from "./types/workflowTypes";
import type { WorkflowCreateYAMLRequest } from "./types/workflowYamlTypes";

type Props = {
  id: string;
};

function downloadFile(fileName: string, contents: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/plain;charset=utf-8,${encodeURIComponent(contents)}`,
  );
  element.setAttribute("download", fileName);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function WorkflowActions({ id }: Props) {
  const queryClient = useQueryClient();
  const { data: workflow } = useWorkflowQuery({ workflowPermanentId: id });
  const router = useMtRouter();

  function handleExport(type: "json" | "yaml") {
    if (!workflow) {
      return;
    }
    const fileName = `${workflow.title}.${type}`;
    const contents =
      type === "json"
        ? JSON.stringify(convert(workflow), null, 2)
        : convertToYAML(convert(workflow));
    downloadFile(fileName, contents);
  }

  const createWorkflowMutation = useMutation({
    mutationFn: async (workflow: WorkflowCreateYAMLRequest) => {
      const client = await getClient(credentialGetter);
      const yaml = convertToYAML(workflow);
      return client.post<string, { data: WorkflowApiResponse }>(
        "/workflows",
        yaml,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        },
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["workflows"],
      });
      router.push(`/workflows/${response.data.workflow_permanent_id}/edit`);
    },
  });

  const deleteWorkflowMutation = useMutation({
    mutationFn: async (id: string) => {
      const client = await getClient(credentialGetter);
      return client.delete(`/workflows/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workflows"],
      });
    },
    onError: (error: AxiosError) => {
      toast({
        variant: "destructive",
        title: "Failed to delete workflow",
        description: error.message,
      });
    },
  });

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline">
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={() => {
              if (!workflow) {
                return;
              }
              const clonedWorkflow = convert({
                ...workflow,
                title: `Copy of ${workflow.title}`,
              });
              createWorkflowMutation.mutate(clonedWorkflow);
            }}
            className="p-2"
          >
            <CopyIcon className="mr-2 h-4 w-4" />
            Clone Workflow
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export as...
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onSelect={() => {
                    handleExport("yaml");
                  }}
                >
                  YAML
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    handleExport("json");
                  }}
                >
                  JSON
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DialogTrigger>
            <DropdownMenuItem className="p-2">
              <GarbageIcon className="mr-2 h-4 w-4 text-destructive" />
              Delete Workflow
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This workflow will be deleted.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              deleteWorkflowMutation.mutate(id);
            }}
            disabled={deleteWorkflowMutation.isPending}
          >
            {deleteWorkflowMutation.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { WorkflowActions };
