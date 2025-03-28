"use client";
// @ts-ignore
import { HtmlDiffer } from "html-differ";
import { useEffect, useRef } from "react";

const styles = {
  none: "background: transparent; color:black",
  gray: "background: transparent; color: gray",
  bgGreen: "background: green; color:black",
  bgRed: "background: red; color:black",
};

/* 代码来自： https://github.com/apollographql/apollo-client-nextjs/tree/main/examples/app-dir-experiments/app
 */
export function HtmlChangesObserver({ children }: React.PropsWithChildren) {
  const targetNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const differ = new HtmlDiffer();
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    let lastHtml = targetNode.current!.innerHTML;

    function observeChanges() {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const newHtml = targetNode.current!.innerHTML;
      if (newHtml !== lastHtml) {
        const diff = differ.diffHtml(lastHtml, newHtml);
        lastHtml = newHtml;
        logDiff(diff);
      }
      if (running) {
        requestAnimationFrame(observeChanges);
      }
    }

    let running = true;
    // MutationObserver was too slow and batched changes together,
    // so we use requestAnimationFrame
    requestAnimationFrame(observeChanges);

    return () => {
      running = false;
    };
  }, []);

  return <div ref={targetNode}>{children}</div>;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function logDiff(diff: any[]) {
  let output = "",
    styleArr: string[] = [];

  if (diff.length === 1 && !diff[0].added && !diff[0].removed) return output;

  for (const part of diff) {
    var index = diff.indexOf(part),
      partValue = part.value;

    if (part.added || part.removed) {
      output += index === 0 ? "\n" : "";
      output += "%c" + partValue;
      styleArr.push(part.added ? styles.bgGreen : styles.bgRed);
    } else {
      output += index !== 0 ? "" : "\n";
      output += "%c" + partValue;
      styleArr.push(styles.gray);
    }
  }
  console.log(performance.now() + "ms DOM changes: " + output, ...styleArr);
}
