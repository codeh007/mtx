"use client";

export const InlineCode = ({ children, ...props }: any) => {
  return (
    <div className="inline relative">
      <code
        {...props}
        className={`
					dark:bg-gray-900 bg-gray-200
					rounded
					px-1.5
					py-0.5
					overflow-x-auto
				`}
      >
        {children}
      </code>
    </div>
  );
};
