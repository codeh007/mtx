import { cn } from "mtxuilib/lib/utils";

type Props = {
  title: string;
  description: string;
  onClick: React.DOMAttributes<HTMLDivElement>["onClick"];
  selected: boolean;
  onMouseEnter: React.DOMAttributes<HTMLDivElement>["onMouseEnter"];
};

export function ActionCard({
  title,
  description,
  selected,
  onClick,
  onMouseEnter,
}: Props) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className={cn(
        "flex cursor-pointer rounded-lg border p-4 shadow-md hover:bg-muted",
        {
          "bg-muted": selected,
        },
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex-1">
        <div className="text-sm">{title}</div>
        <div className="text-sm">{description}</div>
      </div>
    </div>
  );
}
