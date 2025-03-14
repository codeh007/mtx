"use client";
import { type BaseInputTemplateProps, getInputProps } from "@rjsf/utils";
import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  useContext,
  useEffect,
  useRef,
} from "react";
import { JSONFormContext } from "../json-form";

//================================================================================================
// 来自 hatchet 前端
//================================================================================================

export function DynamicSizeInputTemplate(props: BaseInputTemplateProps) {
  const {
    schema,
    id,
    options,
    label,
    value,
    type,
    placeholder,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    onChangeOverride,
    onBlur,
    onFocus,
    rawErrors,
    hideError,
    uiSchema,
    registry,
    formContext,
    ...rest
  } = props;

  const ref = useRef<HTMLTextAreaElement>(null);
  const { form } = useContext(JSONFormContext);

  const onTextChange = ({
    target: { value: val },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    // Use the options.emptyValue if it is specified and newVal is also an empty string
    onChange(val === "" ? options.emptyValue || "" : val);
  };
  const onTextBlur = ({
    target: { value: val },
  }: FocusEvent<HTMLTextAreaElement>) => onBlur(id, val);
  const onTextFocus = ({
    target: { value: val },
  }: FocusEvent<HTMLTextAreaElement>) => onFocus(id, val);

  const inputProps = { ...rest, ...getInputProps(schema, type, options) };
  inputProps.hideLabel = undefined; // hideLabel is not a valid prop for textarea

  const setHeight = (e: HTMLTextAreaElement) => {
    e.style.height = "auto";
    e.style.height = `${e.scrollHeight}px`;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Call adjustHeight whenever the watched value changes externally
    if (!ref.current) {
      return;
    }
    setHeight(ref.current);
  }, [ref.current?.value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!form?.current) {
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      form.current.submit();
    }
  };

  return (
    <textarea
      ref={ref}
      id={id}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readonly}
      className="overflow-y-hidden"
      onKeyDown={handleKeyDown}
      onChange={
        (onChangeOverride as unknown as
          | ((event: ChangeEvent<HTMLTextAreaElement>) => void)
          | undefined) || onTextChange
      }
      onBlur={onTextBlur}
      onFocus={onTextFocus}
      {...inputProps}
    />
  );
}
