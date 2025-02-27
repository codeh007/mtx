"use client";
import { slug } from "github-slugger";
import Link from "next/link";
interface Props {
  text: string;
}

export function SimpleTag({ text }: Props) {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase"
    >
      {text.split(" ").join("-")}
    </Link>
  );
}
