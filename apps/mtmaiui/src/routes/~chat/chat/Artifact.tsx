// import { useStore } from "@nanostores/react";
import { AnimatePresence, motion } from "framer-motion";

import type { ActionState } from "../../../lib/runtime";

import { Icons } from "mtxuilib/icons/icons";

import { useStore } from "@nanostores/react";
import classNames from "classnames";
import { cn } from "mtxuilib/lib/utils";
import { cubicEasingFn } from "mtxuilib/mt/easings";
import { computed } from "nanostores";
import { memo, useEffect, useRef, useState } from "react";
import { useWorkbenchStore } from "../../../stores/workbrench.store";

interface ArtifactProps {
  messageId: string;
}

export const Artifact = memo(({ messageId }: ArtifactProps) => {
  const showWorkbench = useWorkbenchStore((x) => x.openWorkbench);
  const setShowWorkbench = useWorkbenchStore((x) => x.setShowWorkbench);
  const userToggledActions = useRef(false);
  const [showActions, setShowActions] = useState(false);

  // const artifacts = useStore(workbenchStore.artifacts);
  // const artifact = artifacts[messageId];

  const actions = useStore(
    computed(artifact.runner.actions, (actions) => {
      return Object.values(actions);
    }),
  );

  const toggleActions = () => {
    userToggledActions.current = true;
    setShowActions(!showActions);
  };

  useEffect(() => {
    if (actions.length && !showActions && !userToggledActions.current) {
      setShowActions(true);
    }
  }, [actions, showActions]);

  return (
    <div className="artifact border border-bolt-elements-borderColor flex flex-col overflow-hidden rounded-lg w-full transition-border duration-150">
      <div className="flex">
        <button
          type="button"
          className="flex items-stretch bg-bolt-elements-artifacts-background hover:bg-bolt-elements-artifacts-backgroundHover w-full overflow-hidden"
          onClick={() => {
            setShowWorkbench(!showWorkbench);
          }}
        >
          <div className="px-5 p-3.5 w-full text-left">
            <div className="w-full text-bolt-elements-textPrimary font-medium leading-5 text-sm">
              {artifact?.title}
            </div>
            <div className="w-full text-bolt-elements-textSecondary text-xs mt-0.5">
              点击打开工作区
            </div>
          </div>
        </button>
        <div className="bg-bolt-elements-artifacts-borderColor w-[1px]" />
        <AnimatePresence>
          {actions.length && (
            <motion.button
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              exit={{ width: 0 }}
              transition={{ duration: 0.15, ease: cubicEasingFn }}
              className="bg-bolt-elements-artifacts-background hover:bg-bolt-elements-artifacts-backgroundHover"
              onClick={toggleActions}
            >
              <div className="p-4">
                <Icons.chevronDown
                  className={cn("size-5", showActions ? "rotate-180" : "")}
                />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showActions && actions.length > 0 && (
          <motion.div
            className="actions"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: "0px" }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-bolt-elements-artifacts-borderColor h-[1px]" />
            <div className="p-5 text-left bg-bolt-elements-actions-background">
              <ActionList actions={actions} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// const highlighterOptions = {
//   langs: ['shell'],
//   themes: ['light-plus', 'dark-plus'],
// };
interface ShellCodeBlockProps {
  classsName?: string;
  code: string;
}

function ShellCodeBlock({ classsName, code }: ShellCodeBlockProps) {
  const html = useHighlighter(code);
  return (
    <div
      className={classNames("text-xs", classsName)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}

// interface ActionListProps {
//   // actions: ActionState[];
// }

const actionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ActionList = memo(({ actions }: ActionListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <ul className="list-none space-y-2.5">
        {actions.map((action, index) => {
          const { status, type, content } = action;
          const isLast = index === actions.length - 1;

          return (
            <motion.li
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              variants={actionVariants}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.2,
                ease: cubicEasingFn,
              }}
            >
              <div className="flex items-center gap-1.5 text-sm">
                <div
                  className={classNames("text-lg", getIconColor(action.status))}
                >
                  {status === "running" ? (
                    // <div className="i-svg-spinners:90-ring-with-bg" />
                    <Icons.reload className="size-4 animate-spin" />
                  ) : status === "pending" ? (
                    <div className="i-ph:circle-duotone" />
                    // <Icons. className="size-4" />
                  ) : status === "complete" ? (
                    <Icons.check className="size-4" />
                  ) : status === "failed" || status === "aborted" ? (
                    <Icons.X className="size-4" />
                  ) : null}
                </div>
                {type === "file" ? (
                  <div className="flex items-center gap-1">
                    <span>
                      <Icons.plus className="size-4" />
                    </span>
                    <code className="bg-bolt-elements-artifacts-inlineCode-background text-bolt-elements-artifacts-inlineCode-text px-1.5 py-1 rounded-md">
                      {action.filePath}
                    </code>
                  </div>
                ) : type === "shell" ? (
                  <div className="flex items-center w-full min-h-[28px]">
                    <span className="flex-1">执行</span>
                  </div>
                ) : type === "run_workflow" ? (
                  <div className="flex items-center w-full min-h-[28px]">
                    <span className="flex-1">调用工作流</span>
                    {/* <FlowView action={action} /> */}
                    TODO: FlowView
                  </div>
                ) : (
                  <div className="flex items-center w-full min-h-[28px]">
                    未知类型:{type}
                  </div>
                )}
              </div>
              {type === "shell" && (
                <ShellCodeBlock
                  classsName={classNames("mt-1", {
                    "mb-3.5": !isLast,
                  })}
                  code={content}
                />
              )}
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
});

function getIconColor(status: ActionState["status"]) {
  switch (status) {
    case "pending": {
      return "text-bolt-elements-textTertiary";
    }
    case "running": {
      return "text-bolt-elements-loader-progress";
    }
    case "complete": {
      return "text-bolt-elements-icon-success";
    }
    case "aborted": {
      return "text-bolt-elements-textSecondary";
    }
    case "failed": {
      return "text-bolt-elements-icon-error";
    }
    default: {
      return undefined;
    }
  }
}
