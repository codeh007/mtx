import React from "react";

export interface DemoButtonProps {
  /**
   * 按钮显示的文本
   */
  children: React.ReactNode;
  /**
   * 按钮的变体样式
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /**
   * 按钮的尺寸
   */
  size?: "default" | "sm" | "lg";
  /**
   * 是否禁用按钮
   */
  disabled?: boolean;
  /**
   * 点击事件处理函数
   */
  onClick?: () => void;
  /**
   * 自定义 CSS 类名
   */
  className?: string;
}

// 简单的样式类名映射
const getVariantClasses = (variant: string) => {
  switch (variant) {
    case "destructive":
      return "bg-red-500 text-white hover:bg-red-600";
    case "outline":
      return "border border-gray-300 bg-transparent hover:bg-gray-50";
    case "secondary":
      return "bg-gray-200 text-gray-900 hover:bg-gray-300";
    case "ghost":
      return "bg-transparent hover:bg-gray-100";
    case "link":
      return "bg-transparent text-blue-500 underline hover:text-blue-600";
    default:
      return "bg-blue-500 text-white hover:bg-blue-600";
  }
};

const getSizeClasses = (size: string) => {
  switch (size) {
    case "sm":
      return "px-3 py-1.5 text-sm";
    case "lg":
      return "px-6 py-3 text-lg";
    default:
      return "px-4 py-2 text-base";
  }
};

/**
 * 演示用的按钮组件，使用简单的 Tailwind CSS 样式
 */
export const DemoButton = ({
  children,
  variant = "default",
  size = "default",
  disabled = false,
  onClick,
  className = "",
  ...props
}: DemoButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

  return (
    <button
      className={combinedClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
