"use client";

import { useRef } from "react";
import { useFormContext } from "react-hook-form";

import { Slot } from "@radix-ui/react-slot";
import type React from "react";

interface TextFileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  onOpenFile?: (data) => void;
  asChild?: boolean;
  name: string;
}
export const TextFileInput = ({
  onOpenFile,
  name,
  asChild,
  ...props
}: TextFileInputProps) => {
  const formMethods = useFormContext();
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = async (e) => {
    console.log("handleFileChange");
    const file = e.currentTarget.files[0];
    //重设表单，不然再次打开同一个文件，不会触发handlerFileSelect函数的运行。
    formRef.current?.reset();
    console.log("handleFileChange", file);
    readFileOnUpload(file);

    onOpenFile?.(file);
    // const filename = file.name?.toLowerCase();
    // if (filename.endsWith(".json")) {
    //     //应用数据导入
    //     const text = await ReadFileStr(file);
    //     if (text) {
    //         const result = await mtxapi.fetchJson("/sys/db/import-data", {
    //             data: JSON.parse(text),
    //             options: importOptions
    //         });
    //         setImportResult(result);
    //     }
    // } else if (filename.endsWith(".sql")) {
    //     // console.log("TODO: 导入数据库")
    //     mtxapi.upload("/sys/db/import-data", file);
    // }
    // else {
    //     throw new Error("请选择正确的文件格式")
    // }
  };

  const readFileOnUpload = (uploadedFile) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        formMethods.setValue(name, fileReader.result as string);
        // const content = JSON.parse(fileReader.result as string);
        // console.log("content", content)
        //   setErrorData(null)
      } catch (e) {
        //   setErrorData("**Not valid JSON file!**");
        console.log("error", e);
      }
    };
    if (uploadedFile !== undefined) fileReader.readAsText(uploadedFile);
  };

  const Comp = asChild ? Slot : "input";
  return (
    <>
      <Comp
        {...props}
        onClick={(e) => {
          fileRef.current?.click();
          e.preventDefault();
        }}
      />
      <input
        style={{ display: "none" }}
        ref={fileRef}
        accept="json/*"
        type="file"
        onChange={handleFileChange}
      />
    </>
  );
};
