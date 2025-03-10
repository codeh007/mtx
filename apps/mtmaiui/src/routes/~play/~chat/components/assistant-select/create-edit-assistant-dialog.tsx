// import type { Assistant } from "@langchain/langgraph-sdk";
import type * as Icons from "lucide-react";
import type React from "react";
import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

import { TighterText } from "mtxuilib/mt/TighterText";
import { InlineContextTooltip } from "mtxuilib/mt/inline-context-tooltip";
import { Button } from "mtxuilib/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "mtxuilib/ui/dialog";
import { Input } from "mtxuilib/ui/input";
import { Label } from "mtxuilib/ui/label";
import { Textarea } from "mtxuilib/ui/textarea";
import { useToast } from "mtxuilib/ui/use-toast";
// import type { CreateAssistantFields } from "../hooks/useAssistants";
import { ColorPicker } from "./color-picker";
import { IconSelect } from "./icon-select";

interface CreateEditAssistantDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userId: string | undefined;
  isEditing: boolean;
  assistant?: Assistant;
  createCustomAssistant: (
    newAssistant: CreateAssistantFields,
    userId: string,
    successCallback?: (id: string) => void,
  ) => Promise<boolean>;
  editCustomAssistant: (
    editedAssistant: CreateAssistantFields,
    assistantId: string,
    userId: string,
  ) => Promise<Assistant | undefined>;
  isLoading: boolean;
  allDisabled: boolean;
  setAllDisabled: Dispatch<SetStateAction<boolean>>;
}

const GH_DISCUSSION_URL =
  "https://github.com/langchain-ai/open-canvas/discussions/182";

const SystemPromptWhatsThis = (): React.ReactNode => (
  <span className="flex flex-col gap-1 text-sm text-gray-600">
    <p>
      Custom system prompts will be passed to the LLM when generating, or
      re-writing artifacts. They are <i>not</i> used for responding to general
      queries in the chat, highlight to edit, or quick actions.
    </p>
    <p>
      We&apos;re looking for feedback on how to best handle customizing
      assistant prompts. To vote, and give feedba rel="noreferrer"ck please
      visit{" "}
      <a href={GH_DISCUSSION_URL} target="_blank" rel="noreferrer">
        this GitHub discussion
      </a>
      .
    </p>
  </span>
);

export function CreateEditAssistantDialog(
  props: CreateEditAssistantDialogProps,
) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [iconName, setIconName] = useState<keyof typeof Icons>("User");
  const [hasSelectedIcon, setHasSelectedIcon] = useState(false);
  const [iconColor, setIconColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);

  const metadata = props.assistant?.metadata as Record<string, any> | undefined;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (props.assistant && props.isEditing) {
      setName(props.assistant?.name || "");
      setDescription(metadata?.description || "");
      setSystemPrompt(
        (props.assistant?.config?.configurable?.systemPrompt as
          | string
          | undefined) || "",
      );
      setHasSelectedIcon(true);
      setIconName(metadata?.iconData?.iconName || "User");
      setIconColor(metadata?.iconData?.iconColor || "#000000");
    } else if (!props.isEditing) {
      setName("");
      setDescription("");
      setSystemPrompt("");
      setIconName("User");
      setIconColor("#000000");
    }
  }, [props.assistant, props.isEditing]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!props.userId) {
      toast({
        title: "User not found",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    if (props.isEditing && !props.assistant) {
      toast({
        title: "Assistant not found",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    props.setAllDisabled(true);

    let res: boolean;
    if (props.isEditing && props.assistant) {
      res = !!(await props.editCustomAssistant(
        {
          name,
          description,
          systemPrompt,
          iconData: {
            iconName,
            iconColor,
          },
        },
        props.assistant.assistant_id,
        props.userId,
      ));
    } else {
      res = await props.createCustomAssistant(
        {
          name,
          description,
          systemPrompt,
          iconData: {
            iconName,
            iconColor,
          },
        },
        props.userId,
      );
    }

    if (res) {
      toast({
        title: `Assistant ${props.isEditing ? "edited" : "created"} successfully`,
        duration: 5000,
      });
    } else {
      toast({
        title: `Failed to ${props.isEditing ? "edit" : "create"} assistant`,
        variant: "destructive",
        duration: 5000,
      });
    }
    props.setAllDisabled(false);
    props.setOpen(false);
  };

  const handleResetState = () => {
    setName("");
    setDescription("");
    setSystemPrompt("");
    setIconName("User");
    setIconColor("#000000");
  };

  if (props.isEditing && !props.assistant) {
    return null;
  }

  return (
    <Dialog
      open={props.open}
      onOpenChange={(change) => {
        if (!change) {
          handleResetState();
        }
        props.setOpen(change);
      }}
    >
      <DialogContent className="max-w-xl max-h-[90vh] p-8 bg-white rounded-lg shadow-xl min-w-[70vw] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <DialogHeader>
          <DialogTitle className="text-3xl font-light text-gray-800">
            <TighterText>
              {props.isEditing ? "Edit" : "Create"} Assistant
            </TighterText>
          </DialogTitle>
          <DialogDescription className="mt-2 text-md font-light text-gray-600">
            <TighterText>
              Creating a new assistant allows you to tailor your reflections to
              a specific context, as reflections are unique to assistants.
            </TighterText>
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col items-start justify-start gap-4 w-full"
        >
          <Label htmlFor="name">
            <TighterText>
              Name <span className="text-red-500">*</span>
            </TighterText>
          </Label>
          <Input
            disabled={props.allDisabled}
            required
            id="name"
            placeholder="Work Emails"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Label htmlFor="description">
            <TighterText>Description</TighterText>
          </Label>
          <Input
            disabled={props.allDisabled}
            required={false}
            id="description"
            placeholder="Assistant for my work emails"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Label htmlFor="system-prompt">
            <TighterText className="flex items-center">
              System Prompt
              <InlineContextTooltip cardContentClassName="w-[500px] ml-10">
                <SystemPromptWhatsThis />
              </InlineContextTooltip>
            </TighterText>
          </Label>
          <Textarea
            disabled={props.allDisabled}
            required={false}
            id="system-prompt"
            placeholder="You are an expert email assistant..."
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={5}
          />

          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex flex-col gap-4 items-start justify-start w-full">
              <Label htmlFor="icon">
                <TighterText>Icon</TighterText>
              </Label>
              <IconSelect
                allDisabled={props.allDisabled}
                iconColor={iconColor}
                selectedIcon={iconName}
                setSelectedIcon={(i) => {
                  setHasSelectedIcon(true);
                  setIconName(i);
                }}
                hasSelectedIcon={hasSelectedIcon}
              />
            </div>
            <div className="flex flex-col gap-4 items-start justify-start w-full">
              <Label htmlFor="description">
                <TighterText>Color</TighterText>
              </Label>
              <div className="flex gap-1 items-center justify-start w-full">
                <ColorPicker
                  disabled={props.allDisabled}
                  iconColor={iconColor}
                  setIconColor={setIconColor}
                  showColorPicker={showColorPicker}
                  setShowColorPicker={setShowColorPicker}
                  hoverTimer={hoverTimer}
                  setHoverTimer={setHoverTimer}
                />
                <Input
                  disabled={props.allDisabled}
                  required={false}
                  id="description"
                  placeholder="Assistant for my work emails"
                  value={iconColor}
                  onChange={(e) => {
                    if (!e.target.value.startsWith("#")) {
                      setIconColor(`#${e.target.value}`);
                    } else {
                      setIconColor(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center w-full mt-4 gap-3">
            <Button
              disabled={props.allDisabled}
              className="w-full"
              type="submit"
            >
              <TighterText>Save</TighterText>
            </Button>
            <Button
              disabled={props.allDisabled}
              onClick={() => {
                handleResetState();
                props.setOpen(false);
              }}
              variant="destructive"
              className="w-[20%]"
              type="button"
            >
              <TighterText>Cancel</TighterText>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
