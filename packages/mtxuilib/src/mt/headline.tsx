"use client";
interface HeadlineProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function Headline({ heading, text, children }: HeadlineProps) {
  return (
    <div className="flex justify-between">
      <div className="grid gap-1">
        <h1 className="text-brandtext-500 text-2xl font-bold tracking-wide">
          {heading}
        </h1>
        {text && <p className="text-brandtext-600">{text}</p>}
      </div>
    </div>
  );
}
