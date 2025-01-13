"use client";
import { Icons } from "../../icons/index.tsx--";
import { Input } from "../../ui/input";

interface SearchInputProps {
  value?: string;
  onChange?: (value?: string) => void;
}
export const SearchInput = (props: SearchInputProps) => {
  const { value = "", onChange, ...rest } = props;
  // const form = useFormContext();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };
  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <Icons.search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search..."
        className="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px]"
        {...rest}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
