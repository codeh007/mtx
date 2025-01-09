"use client";

import { type ChangeEvent, useState } from "react";
import { Input, type InputProps } from "../../ui/input";

/**
 * 标签输入框
 * 参考： https://viclafouch.github.io/mui-chips-input/
 */
export const TagsInput = (
	props: InputProps & { onChange?: (value: string[]) => void },
) => {
	const { name, placeholder, onChange, value } = props;
	if (!name) throw new Error("require field name @ TagsInput");
	const [tags, setTags] = useState<string[]>((value as string[]) || []);
	const [inputValue, setInputValue] = useState("");

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			addTag();
		}
	};

	const addTag = () => {
		const trimmedInput = inputValue.trim();
		if (trimmedInput && !tags.includes(trimmedInput)) {
			const newTags = [...tags, trimmedInput];
			setTags(newTags);
			setInputValue("");

			onChange?.(newTags);
		} else {
			setInputValue("");
		}
	};

	const removeTag = (indexToRemove: number) => {
		setTags(tags.filter((_, index) => index !== indexToRemove));
		onChange?.(tags.filter((_, index) => index !== indexToRemove));
	};

	return (
		<div className="flex flex-col space-y-2">
			<div className="flex flex-wrap gap-2 p-2 bg-white border border-gray-300 rounded-md">
				{tags.map((tag, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full"
					>
						{tag}
						<button
							type="button"
							onClick={() => removeTag(index)}
							className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
						>
							&times;
						</button>
					</div>
				))}
				<Input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleInputKeyDown}
					onBlur={addTag}
					placeholder={
						placeholder || "Type and press Enter or Space to add tags"
					}
					className="flex-grow min-w-[120px] border-none focus:ring-0"
				/>
			</div>
		</div>
	);
};
