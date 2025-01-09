import type { DialogProps } from "@radix-ui/react-dialog";
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export type EditDlgProps = {
  onSubmit: (values: any) => Promise<void>;
  onDelete: (values: any) => Promise<void>;
  defaultValues?: any;
} & DialogProps;

export type MaybePromise<TType> = Promise<TType> | TType;
export type Nullable<T> = { [P in keyof T]: T[P] | null };
declare function MaybePromise<T>(value: T): T | Promise<T> | PromiseLike<T>;
export type searchParams = { [key: string]: string | string[] | undefined };
