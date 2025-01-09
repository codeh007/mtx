"use client";

import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";

export const DebugFormState = (props: {
  form: UseFormReturn;
}) => {
  const { form } = props;
  useMemo(() => {
    if (
      form?.formState?.errors &&
      Object.keys(form?.formState?.errors).length > 0
    ) {
      console.warn("DebugFormState", form?.formState?.errors);
    }
  }, [form?.formState?.errors]);
  return null;
};
