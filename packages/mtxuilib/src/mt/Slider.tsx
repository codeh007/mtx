"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { cn } from "../lib/utils";

import { genericMemo } from "../lib/react";
import { cubicEasingFn } from "./easings";

interface SliderOption<T> {
  value: T;
  text: string;
}

export interface SliderOptions<T> {
  left: SliderOption<T>;
  right: SliderOption<T>;
}

interface SliderProps<T> {
  selected: T;
  options: SliderOptions<T>;
  setSelected?: (selected: T) => void;
}

export const MtSlider = genericMemo(
  <T,>({ selected, options, setSelected }: SliderProps<T>) => {
    const isLeftSelected = selected === options.left.value;

    return (
      <div className="flex items-center flex-wrap shrink-0 gap-1 bg-bolt-elements-background-depth-1 overflow-hidden rounded-full p-1">
        <SliderButton
          selected={isLeftSelected}
          setSelected={() => setSelected?.(options.left.value)}
        >
          {options.left.text}
        </SliderButton>
        <SliderButton
          selected={!isLeftSelected}
          setSelected={() => setSelected?.(options.right.value)}
        >
          {options.right.text}
        </SliderButton>
        <SliderButton
          selected={!isLeftSelected}
          setSelected={() => setSelected?.(options.right.value)}
        >
          {options.right.text}
        </SliderButton>
        <SliderButton
          selected={!isLeftSelected}
          setSelected={() => setSelected?.(options.right.value)}
        >
          {options.right.text}
        </SliderButton>
      </div>
    );
  },
);

interface SliderButtonProps {
  selected: boolean;
  children: string | JSX.Element | Array<JSX.Element | string>;
  setSelected: () => void;
}

const SliderButton = memo(
  ({ selected, children, setSelected }: SliderButtonProps) => {
    return (
      <button
        type="button"
        onClick={setSelected}
        className={cn(
          "bg-transparent text-sm px-2.5 py-0.5 rounded-full relative",
          selected
            ? "text-bolt-elements-item-contentAccent"
            : "text-bolt-elements-item-contentDefault hover:text-bolt-elements-item-contentActive",
        )}
      >
        <span className="relative z-10">{children}</span>
        {selected && (
          <motion.span
            layoutId="pill-tab"
            transition={{ duration: 0.2, ease: cubicEasingFn }}
            /* @ts-ignore*/
            className="absolute inset-0 z-0 bg-bolt-elements-item-backgroundAccent rounded-full"
          />
        )}
      </button>
    );
  },
);
