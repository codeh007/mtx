"use client";
import { interpolate, useCurrentFrame } from "remotion";

/**
 * 标题组件(暂时没发挥作用)
 * @param title 标题
 * @returns
 */
export const Title: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return <div style={{ opacity, textAlign: "center", fontSize: "7em" }}>{title}</div>;
};
