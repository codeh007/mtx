"use client";
import { PlayIcon } from "@radix-ui/react-icons";
import Form from "@rjsf/core";
import type {
  RJSFSchema,
  RJSFValidationError,
  UiSchema,
  ValidationData,
  ValidatorType,
} from "@rjsf/utils";
import { createContext, useRef } from "react";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { CollapsibleSection } from "./inputs/collapsible-section";
import { DynamicSizeInputTemplate } from "./inputs/dynamic-size-input-template";
import { MtLoading } from "./mtloading";
//================================================================================================
// 来自 hatchet 前端
//================================================================================================

type JSONPrimitive = string | number | boolean | null | Array<JSONPrimitive>;
export type JSONType = {
  [key: string]: JSONType | JSONPrimitive | Array<JSONType>;
};

export const DEFAULT_COLLAPSED = ["advanced", "user data"];

class NoValidation implements ValidatorType {
  validateFormData(): ValidationData<any> {
    return { errors: [], errorSchema: {} };
  }

  toErrorList(): RJSFValidationError[] {
    return [];
  }

  isValid(): boolean {
    return true;
  }

  rawValidation() {
    return {};
  }
}

interface JSONFormContextSchema {
  form?: React.RefObject<Form>;
}

export const JSONFormContext = createContext<JSONFormContextSchema>({
  form: undefined,
});

export function JsonForm({
  inputSchema,
  inputData,
  className,
  setInput,
  disabled,
  onSubmit,
}: {
  inputSchema: JSONType;
  className?: string;
  inputData: JSONType;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  onSubmit: () => void;
}) {
  const formRef = useRef<Form>(null);

  const schema = {
    ...inputSchema,
    required: undefined,
    $schema: undefined,
    properties: {
      ...(inputSchema.properties as any),
      triggered_by: undefined,
      advanced: {
        // Transform the schema to wrap the triggered by field
        type: "object",
        properties: {
          triggered_by: inputSchema.properties
            ? (inputSchema.properties as any).triggered_by
            : undefined,
        },
      },
    },
  } as RJSFSchema;

  // biome-ignore lint/performance/noDelete: <explanation>
  delete schema.properties?.triggered_by;

  const uiSchema: UiSchema<any, RJSFSchema, any> = {
    input: {
      "ui:title": "workflow input",
    },
    parents: {
      "ui:title": "parent step data",
    },
    overrides: {
      "ui:title": "step overrides",
    },
    user_data: {
      "ui:title": "user data",
    },
    "ui:order": ["input", "overrides", "parents", "*"],
  };

  return (
    /* @ts-ignore*/
    <JSONFormContext.Provider value={{ form: formRef }}>
      <div
        className={cn(
          className,
          "w-full h-fit relative rounded-lg overflow-hidden",
        )}
      >
        <Form
          ref={formRef}
          formData={inputData}
          schema={schema}
          disabled={disabled}
          templates={{
            BaseInputTemplate: DynamicSizeInputTemplate,
            ObjectFieldTemplate: CollapsibleSection,
          }}
          uiSchema={uiSchema}
          validator={new NoValidation()}
          noHtml5Validate={true}
          onChange={(data) => {
            // Transform the data to unwrap the advanced fields
            const formData = { ...data.formData, ...data.formData.advanced };
            formData.advanced = undefined;
            setInput((prev) =>
              JSON.stringify({
                ...JSON.parse(prev),
                ...formData,
              }),
            );
          }}
          onSubmit={onSubmit}
          onError={(e) => {
            console.error(e);
          }}
        >
          <Button className="w-fit invisible" disabled={disabled}>
            {disabled ? (
              <>
                <MtLoading />
                Playing
              </>
            ) : (
              <>
                <PlayIcon
                  className={cn(disabled ? "rotate-180" : "", "h-4 w-4 mr-2")}
                />
                Play Step
              </>
            )}
          </Button>
        </Form>
      </div>
    </JSONFormContext.Provider>
  );
}
