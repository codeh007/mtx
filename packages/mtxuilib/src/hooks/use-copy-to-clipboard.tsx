'use client'


import { useState } from 'react';
export interface useCopyToClipboardProps {
  timeout?: number
}

// export function useCopyToClipboard({
//   timeout = 2000
// }: useCopyToClipboardProps) {
//   const [isCopied, setIsCopied] = React.useState<Boolean>(false)

//   const copyToClipboard = (value: string) => {
//     if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
//       return
//     }

//     if (!value) {
//       return
//     }

//     navigator.clipboard.writeText(value).then(() => {
//       setIsCopied(true)

//       setTimeout(() => {
//         setIsCopied(false)
//       }, timeout)
//     })
//   }

//   return { isCopied, copyToClipboard }
// }

export const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};
