"use client";

import { motion } from "framer-motion";
import { memo } from "react";

import { genericMemo } from "../lib/react";
import { classNames } from "../lib/utils";
import { cubicEasingFn } from "./easings";

interface SliderOption<T> {
  value: T;
  text: string;
}

export interface SliderProps<T> {
  selected: T;
  options: SliderOption<T>[];
  setSelected?: (selected: T) => void;
}
/*******************************************************************************************
 * 类似 tabs 切换 按钮组，特点是自动滑动到选中的按钮，效果不错。
 * 用例：
 * 			<MtSlider
				selected={currentView}
				options={[
					{ value: "list", text: "列表" },
					{ value: "detail1", text: "详情1" },
					{ value: "detail2", text: "详情2" },
					{ value: "detail3", text: "详情3" },
					{ value: "detail4", text: "详情4" },
				]}
				setSelected={setCurrentView}
			/>
 *******************************************************************************************/
export const MtSlider = genericMemo(
  <T,>({ selected, options, setSelected }: SliderProps<T>) => {
    return (
      <div className="flex items-center flex-wrap shrink-0 gap-1 bg-bolt-elements-background-depth-1 overflow-hidden rounded-full p-1">
        {options.map((option) => (
          <SliderButton
            key={String(option.value)}
            selected={selected === option.value}
            setSelected={() => setSelected?.(option.value)}
          >
            {option.text}
          </SliderButton>
        ))}
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
        className={classNames(
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
