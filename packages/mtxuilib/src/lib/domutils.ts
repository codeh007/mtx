'use client'
/**
 * 判断父元素下的直接子元素是否在可视范围
 * @param element
 * @param container
 * @param rightPadding 右侧预留空间(像素)
 * @returns
 */
export const isElementVisible = (element: HTMLElement, container: HTMLElement, rightPadding: number): boolean => {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return (
    elementRect.left >= containerRect.left &&
    elementRect.right + rightPadding <= containerRect.right
  );
};

/**
 * 将 html 字符串，转化为 dom 对象
 *
 * 提示： 使用 DOMParser （或相关浏览器api），对于将dom节点转化为html 或者html 转化为dom 节点，有很大帮助。
 *       特别在编辑器的场景中。
 * @param htmlMark
 */
export const htmlToDom = (htmlMark: string) => {
  const html = `<html><body>${htmlMark}</body></html>`;

  const doc = new DOMParser().parseFromString(html, 'text/html');
}
