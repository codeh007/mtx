"use client";

import type { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { Input, type InputProps } from "../../ui/input";

export const UrlsInput = (props: InputProps) => {
	const { name, placeholder } = props;
	if (!name) throw new Error("require field name @ UrlsInputField");
	const form = useFormContext();
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		//TODO: 根据约定格式，值转换为url 字符串序列。
		const _value = [e.target.value];
		form.setValue(name, _value);
	};
	return (
		<>
			<Input placeholder={placeholder} onChange={handleChange} />
		</>
	);
};
