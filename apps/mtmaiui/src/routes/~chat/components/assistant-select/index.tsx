import type { Assistant } from "@langchain/langgraph-sdk";
import * as Icons from "lucide-react";
import { OC_HAS_SEEN_CUSTOM_ASSISTANTS_ALERT } from "mtxuilib/constants";
import React, { useState } from "react";

import { TighterText } from "mtxuilib/mt/TighterText";
import { TooltipIconButton } from "mtxuilib/mt/tooltip-icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "mtxuilib/ui/dropdown-menu";
import { useToast } from "mtxuilib/ui/use-toast";
import { AlertNewAssistantsFeature } from "./alert-new-feature";
import { AssistantItem } from "./assistant-item";
import { CreateEditAssistantDialog } from "./create-edit-assistant-dialog";
import { getIcon } from "./utils";

interface AssistantSelectProps {
  userId: string | undefined;
  chatStarted: boolean;
}

function AssistantSelectComponent(props: AssistantSelectProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [createEditDialogOpen, setCreateEditDialogOpen] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState<
    Assistant | undefined
  >();
  const [allDisabled, setAllDisabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleNewAssistantClick = (event: Event) => {
    event.preventDefault();
    setCreateEditDialogOpen(true);
  };

  const handleDeleteAssistant = async (assistantId: string) => {
    setAllDisabled(true);
    const res = await deleteAssistant(assistantId);
    if (res) {
      toast({
        title: "Assistant deleted",
        duration: 5000,
      });
    }
    setAllDisabled(false);
    return res;
  };

  const handleHideNewFeatureAlert = () => {
    if (showAlert) {
      setShowAlert(false);
      localStorage.setItem(OC_HAS_SEEN_CUSTOM_ASSISTANTS_ALERT, "true");
    }
  };

  const metadata = selectedAssistant?.metadata as Record<string, any>;

  return (
    <>
      <div className="relative">
        <DropdownMenu
          open={open}
          onOpenChange={(c) => {
            if (!c) {
              setEditingAssistant(undefined);
              setCreateEditDialogOpen(false);
            }
            setOpen(c);
          }}
        >
          <DropdownMenuTrigger className="text-gray-600" asChild>
            <TooltipIconButton
              tooltip="Change assistant"
              variant="ghost"
              delayDuration={200}
              className="w-8 h-8 transition-colors ease-in-out duration-200"
              style={{ color: metadata?.iconData?.iconColor || "#4b5563" }}
            >
              {getIcon(metadata?.iconData?.iconName as string | undefined)}
            </TooltipIconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-[600px] max-w-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ml-4">
            <DropdownMenuLabel>
              <TighterText>My Assistants</TighterText>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isLoadingAllAssistants && !assistants?.length ? (
              <span className="text-sm text-gray-600 flex items-center justify-start gap-1 p-2">
                Loading
                <Icons.LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              <>
                <DropdownMenuItem
                  onSelect={(e) => {
                    handleNewAssistantClick(e);
                    handleHideNewFeatureAlert();
                  }}
                  className="flex items-center justify-start gap-2"
                  disabled={allDisabled}
                >
                  <Icons.CirclePlus className="size-4" />
                  <TighterText className="font-medium">New</TighterText>
                </DropdownMenuItem>
                {assistants.map((assistant) => (
                  <AssistantItem
                    setAllDisabled={setAllDisabled}
                    allDisabled={allDisabled}
                    key={assistant.assistant_id}
                    assistant={assistant}
                    setEditModalOpen={setCreateEditDialogOpen}
                    setAssistantDropdownOpen={setOpen}
                    setEditingAssistant={setEditingAssistant}
                    deleteAssistant={handleDeleteAssistant}
                    selectedAssistantId={selectedAssistant?.assistant_id}
                    onClick={() => {
                      if (
                        selectedAssistant?.assistant_id ===
                        assistant.assistant_id
                      ) {
                        setOpen(false);
                        return;
                      }
                      setSelectedAssistant(assistant);
                      handleHideNewFeatureAlert();
                    }}
                  />
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="absolute left-1/2 -translate-x-1/2 mt-6 w-[500px]">
          <AlertNewAssistantsFeature
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            shouldRender={!props.chatStarted}
          />
        </div>
      </div>

      <CreateEditAssistantDialog
        allDisabled={allDisabled}
        setAllDisabled={setAllDisabled}
        open={createEditDialogOpen}
        setOpen={(c) => {
          if (!c) {
            setEditingAssistant(undefined);
          }
          setCreateEditDialogOpen(c);
        }}
        userId={props.userId}
        isEditing={!!editingAssistant}
        assistant={editingAssistant}
        createCustomAssistant={async (
          newAssistant,
          userId,
          successCallback,
        ) => {
          const res = await createCustomAssistant(
            newAssistant,
            userId,
            successCallback,
          );
          setOpen(false);
          return res;
        }}
        editCustomAssistant={async (editedAssistant, assistantId, userId) => {
          const res = await editCustomAssistant(
            editedAssistant,
            assistantId,
            userId,
          );
          setOpen(false);
          return res;
        }}
        isLoading={isLoadingAllAssistants}
      />
    </>
  );
}

export const AssistantSelect = React.memo(AssistantSelectComponent);
