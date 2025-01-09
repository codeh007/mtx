

/**
 * 演示：使用cloudflared 的 HTMLRewriter api 实现 html 重写
 */

const OLD_URL = "https://workers.cloudflare.com";
const NEW_URL = "https://workers.cloudflare.com/ssssssssssssssssssssss";
class AttributeRewriter {
  private attributeName = ""
  constructor(attributeName: string) {
    this.attributeName = attributeName;
  }
  element(element: any) {
    const attribute = element.getAttribute(this.attributeName);
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace(OLD_URL, NEW_URL)
      );
    }
  }
}

export const htmlRewriterExample = async (request: Request) => {
  // const targetUrl = "https://developers.cloudflare.com/workers/examples/rewrite-links/"
  // const rewriter = new HTMLRewriter()
  //   .on("a", new AttributeRewriter("href"))
  //   .on("img", new AttributeRewriter("src"));
  // const res = await fetch(targetUrl);
  // const contentType = res.headers.get("Content-Type");
  // if (contentType?.startsWith("text/html")) {
  //   return rewriter.transform(res);
  // } else {
  //   return res;
  // }
}
