/**
 * 封装 基于nextjs 的 <Image> 组件
 */
import Image, { type ImageLoader } from "next/image";
import type { ComponentProps } from "react";
import { isCloudflarePage } from "../lib/sslib";

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

const cloudflareLoader: ImageLoader = ({ src, width, quality }) => {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(",");
  return `https://cfgomtm.yuepa8.com/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
};

const exampleImageLoader: ImageLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`;
};

function getImageLoader() {
  if (isCloudflarePage()) {
    return cloudflareLoader;
  }
  exampleImageLoader;
}
type Props = ComponentProps<typeof Image>;
export const MtImage = (props: Props) => {
  // const [imageLoader, setImageLoader] = useState(null)
  // eslint-disable-next-line jsx-a11y/alt-text
  return (
    <Image
      {...props}
      loader={getImageLoader()}
      // loader={exampleImageLoader}
    />
  );
};
