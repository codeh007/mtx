import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Bot,
  Brain,
  // ChevronDown,
  Maximize2,
  Minimize2,
  Timer,
  Wrench,
} from "lucide-react";
import { Button } from "mtxuilib/ui/button";
// import { Collapse } from "mtxuilib/ui/collapsible";
import { Input } from "mtxuilib/ui/input";
import React from "react";
import { useGalleryStore } from "../../../../~gallery/store";

interface ComponentConfigTypes {
  [key: string]: any;
}

type ComponentTypes = "agent" | "model" | "tool" | "termination";

type LibraryProps = {};

interface PresetItemProps {
  id: string;
  type: ComponentTypes;
  config: ComponentConfigTypes;
  label: string;
  icon: React.ReactNode;
}

const PresetItem: React.FC<PresetItemProps> = ({
  id,
  type,
  config,
  label,
  icon,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        current: {
          type,
          config,
          label,
        },
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 text-primary mb-2 border border-secondary rounded cursor-move hover:bg-secondary transition-colors"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
    </div>
  );
};

export const ComponentLibrary: React.FC<LibraryProps> = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isMinimized, setIsMinimized] = React.useState(false);
  const defaultGallery = useGalleryStore((state) => state.getDefaultGallery());

  if (!defaultGallery) {
    return null;
  }
  // Map gallery components to sections format
  const sections = React.useMemo(
    () => [
      {
        title: "Agents",
        type: "agent" as ComponentTypes,
        items: defaultGallery.items.components.agents.map((agent) => ({
          label: agent.name,
          config: agent,
        })),
        icon: <Bot className="size-4" />,
      },
      {
        title: "Models",
        type: "model" as ComponentTypes,
        items: defaultGallery.items.components.models.map((model) => ({
          label: `${model.model_type} - ${model.model}`,
          config: model,
        })),
        icon: <Brain className="size-4" />,
      },
      {
        title: "Tools",
        type: "tool" as ComponentTypes,
        items: defaultGallery.items.components.tools.map((tool) => ({
          label: tool.name,
          config: tool,
        })),
        icon: <Wrench className="size-4" />,
      },
      {
        title: "Terminations",
        type: "termination" as ComponentTypes,
        items: defaultGallery.items.components.terminations.map(
          (termination) => ({
            label: `${termination.termination_type}`,
            config: termination,
          }),
        ),
        icon: <Timer className="size-4" />,
      },
    ],
    [defaultGallery],
  );

  const items = sections.map((section) => {
    const filteredItems = section.items.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return {
      key: section.title,
      label: (
        <div className="flex items-center gap-2 font-medium">
          {section.icon}
          <span>{section.title}</span>
          <span className="text-xs text-gray-500">
            ({filteredItems.length})
          </span>
        </div>
      ),
      children: (
        <div className="space-y-2">
          {filteredItems.map((item, itemIndex) => (
            <PresetItem
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={itemIndex}
              id={`${section.title.toLowerCase()}-${itemIndex}`}
              type={section.type}
              config={item.config}
              label={item.label}
              icon={section.icon}
            />
          ))}
        </div>
      ),
    };
  });

  if (isMinimized) {
    return (
      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
      <div
        onClick={() => setIsMinimized(false)}
        className="absolute group top-4 left-4 bg-primary shadow-md rounded px-4 pr-2 py-2 cursor-pointer transition-all duration-300 z-50 flex items-center gap-2"
      >
        <span>Show Component Library</span>
        <Button
          onClick={() => setIsMinimized(false)}
          className="p-1 group-hover:bg-tertiary rounded transition-colors"
          title="Maximize Library"
        >
          <Maximize2 className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="z-10 mr-2 border-r border-secondary w-64">
      <div className="rounded p-2 pt-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-normal">Component Library</div>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-tertiary rounded transition-colors"
            title="Minimize Library"
          >
            <Minimize2 className="size-4" />
          </button>
        </div>

        <div className="mb-4">Drag a component to add it to the team</div>

        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Search components..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2"
          />
        </div>

        {/* <Collapse
          items={items}
          defaultActiveKey={["Agents"]}
          bordered={false}
          expandIcon={({ isActive }) => (
            <ChevronDown
              strokeWidth={1}
              className={`${isActive ? "transform rotate-180" : ""} size-4`}
            />
          )}
        /> */}
      </div>
    </div>
  );
};
