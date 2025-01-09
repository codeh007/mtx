"use client";

import {
  type ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * 代码来自： https://github.com/martinshaw/react-document-picture-in-picture/blob/master/packages/component/src/ReactDocumentPictureInPicture.tsx
 * chrome api 参考文档：
 *  https://developer.chrome.com/docs/web-platform/document-picture-in-picture/
 *
 * 学习：
 *  pipWindow 的方式，本质上，跟 打开 open window 的api 无太多差异，内部也只是 父子窗口的关系。
 *  所以不能完整共享上下文，只能够通过窗体通信和dom 相关api 的方式创建 对应的 dom，并且挂载相关的 element元素。
 *
 *  本组件 看起源码，也只不过是 使用了 document.body.append(contentElement)的方式，将父窗体的dom 复制过来，而父窗体的react 上下文不能直接共享。
 *
 * If you wish, you can interact with the window, its document's DOM, and convenience
 *   methods imperatively using the `ref` prop.
 *
 * Due to Chrome's current security policy regarding the Document Picture in Picture
 *   feature, you cannot open a new window programmatically.
 *
 * You should instead use the `children` prop to render a button or other element
 *   which calls the `open` method on user interaction.
 */

export type ReactDocumentPictureInPictureForwardRefType = {
  window: () => Window | undefined;
  isOpen: boolean;
  close: () => void;
};

export enum FeatureUnavailableReasonEnum {
  USING_UNSECURE_PROTOCOL = "USING_UNSECURE_PROTOCOL",
  API_NOT_SUPPORTED = "API_NOT_SUPPORTED",
}

export type ReactDocumentPictureInPicturePropsType = {
  width?: string | number;
  height?: string | number;
  shareStyles?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onResize?: (width: number, height: number) => void;
  featureUnavailableRenderer?:
    | ReactNode
    | ((reason: FeatureUnavailableReasonEnum) => ReactNode);
  buttonRenderer?:
    | ReactNode
    | ((props: {
        open: () => void;
        close: () => void;
        toggle: () => void;
        isOpen: boolean;
      }) => ReactNode);
  children?: ReactNode;
};

const ReactDocumentPictureInPicture = forwardRef<
  ReactDocumentPictureInPictureForwardRefType,
  ReactDocumentPictureInPicturePropsType
  //@ts-ignore
>((props, ref) => {
  /* @ts-ignore*/
  const contentRef = useRef<HTMLDivElement>();
  /* @ts-ignore*/
  const pipWindow = useRef<Window>();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const absoluteDimensions = useMemo(() => {
    if (typeof window !== "undefined") {
      let absoluteWidth = 500;
      let absoluteHeight = 400;

      if (typeof props.width === "number") absoluteWidth = props.width;
      else if (typeof props.width === "string") {
        if (props.width.endsWith("px"))
          absoluteWidth = Number.parseInt(props.width);
        else if (props.width.endsWith("%"))
          absoluteWidth =
            window?.innerWidth * (Number.parseInt(props.width) / 100);
      }

      if (typeof props.height === "number") absoluteHeight = props.height;
      else if (typeof props.height === "string") {
        if (props.height.endsWith("px"))
          absoluteHeight = Number.parseInt(props.height);
        else if (props.height.endsWith("%"))
          absoluteHeight =
            window?.innerHeight * (Number.parseInt(props.height) / 100);
      }

      return { width: absoluteWidth, height: absoluteHeight };
    }
  }, [props.width, props.height]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const close = useCallback(() => {
    if (pipWindow.current == null) return;

    //@ts-ignore
    pipWindow.current?.close();

    setIsOpen(false);

    if (props.onClose) props.onClose();
  }, [contentRef, pipWindow, setIsOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const open = useCallback(async () => {
    if (contentRef.current == null) return;
    if (typeof window !== "undefined") {
      const contentElement = contentRef.current;
      //@ts-ignore
      pipWindow.current = await window?.documentPictureInPicture.requestWindow({
        ...absoluteDimensions,
      });

      if (props.shareStyles === true) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        [...document.styleSheets].forEach((styleSheet) => {
          try {
            const cssRules = [...styleSheet.cssRules]
              .map((rule) => rule.cssText)
              .join("");
            const style = document.createElement("style");

            style.textContent = cssRules;
            //@ts-ignore
            pipWindow?.current.document.head.appendChild(style);
          } catch (e) {
            const link = document.createElement("link");

            link.rel = "stylesheet";
            link.type = styleSheet.type;
            if (styleSheet.media.length > 0) {
              link.media = styleSheet.media.mediaText;
            }
            link.href = styleSheet.href || "";
            //@ts-ignore
            pipWindow.current?.document.head.appendChild(link);
          }
        });
      }

      //@ts-ignore
      pipWindow.current.document.body.append(contentElement);

      //@ts-ignore
      pipWindow.current.addEventListener("pagehide", () => close());
      //@ts-ignore
      pipWindow.current.addEventListener("resize", (event) => {
        if (props.onResize)
          props.onResize(
            //@ts-ignore
            (event.target as Window).innerWidth,
            //@ts-ignore
            (event.target as Window).innerHeight,
          );
      });

      setIsOpen(true);

      if (props.onOpen) props.onOpen();
    }
  }, [
    contentRef,
    pipWindow,
    setIsOpen,
    close,
    absoluteDimensions,
    props.shareStyles,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const toggle = useCallback(() => (isOpen ? close() : open()), [isOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useImperativeHandle(
    ref,
    () => ({
      window: () => pipWindow.current,
      isOpen,
      close,
    }),
    [pipWindow, isOpen, close],
  );

  const featureUnavailableReason: FeatureUnavailableReasonEnum | null = (() => {
    if (typeof window !== "undefined") {
      const isUsingSecureProtocol = window?.location.protocol === "https:";
      if (isUsingSecureProtocol === false)
        return FeatureUnavailableReasonEnum.USING_UNSECURE_PROTOCOL;

      const featureIsAvailable = "documentPictureInPicture" in window;
      if (featureIsAvailable === false)
        return FeatureUnavailableReasonEnum.API_NOT_SUPPORTED;
    }

    return null;
  })();

  if (
    featureUnavailableReason != null &&
    props.featureUnavailableRenderer == null
  )
    return;

  if (featureUnavailableReason != null) {
    const featureUnavailableRenderer: ReactNode =
      typeof props.featureUnavailableRenderer === "function"
        ? props.featureUnavailableRenderer(featureUnavailableReason)
        : props.featureUnavailableRenderer;
    return featureUnavailableRenderer;
  }

  const buttonRenderer: ReactNode =
    typeof props.buttonRenderer === "function"
      ? props.buttonRenderer({ open, close, toggle, isOpen })
      : props.buttonRenderer;

  return (
    <div>
      {buttonRenderer}
      {/* @ts-ignore */}
      <div
        //@ts-ignore
        ref={contentRef}
        style={{
          display: isOpen ? "block" : "none",
          width: "100%",
          height: "100%",
        }}
      >
        {props.children}
      </div>
    </div>
  );
});

ReactDocumentPictureInPicture.displayName = "ReactDocumentPictureInPicture";
export default ReactDocumentPictureInPicture;
