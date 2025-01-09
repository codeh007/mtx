"use client";

import { useState } from "react";

/**
 * 仿 mui-chips-input， 参考官网：
 * https://viclafouch.github.io/mui-chips-input/
 *
 * 目前时ai 辅助生成的代码，功能还需要继续完善
 * @param param0
 * @returns
 */
export function MuiChipsInput({
	onChange,
	value = [],
	placeholder = "Add chip...",
}) {
	const [inputValue, setInputValue] = useState("");

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const handleInputKeyDown = (e) => {
		if (e.key === "Enter" && inputValue.trim()) {
			onChange([...value, inputValue.trim()]);
			setInputValue("");
		}
	};

	const removeChip = (chipToRemove) => {
		onChange(value.filter((chip) => chip !== chipToRemove));
	};

	return (
		<div className="flex flex-wrap items-center p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
			TODO: 目前时ai 辅助生成的代码，功能还需要继续完善
			{value.map((chip, index) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={index}
					className="flex items-center bg-gray-200 rounded-full px-3 py-1 m-1"
				>
					<span className="text-sm">{chip}</span>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						onClick={() => removeChip(chip)}
						className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
					>
						&times;
					</button>
				</div>
			))}
			<input
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				onKeyDown={handleInputKeyDown}
				placeholder={placeholder}
				className="flex-grow outline-none px-2 py-1"
			/>
		</div>
	);
}
