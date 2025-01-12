"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { postListOptions } from "mtmaiapi";

export default function Page(props: { params }) {
  const postQuery = useSuspenseQuery({
    ...postListOptions({}),
  });
  return (
    <div className="prose dark:prose-invert">
      <h1>wellcome6</h1>
      <pre>{JSON.stringify(postQuery.data, null, 2)}</pre>
    </div>
  );
}
