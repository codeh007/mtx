import { createRouter } from "../../lib/createApp";

const r2Router = createRouter();

//下载
r2Router.all("/r2/get", async (c) => {
  const url = new URL(c.req.url);
  const objectName = url.searchParams.get("key");

  console.log("r2 get  objectName", objectName);
  if (!objectName) {
    return c.text("缺少 'key' 查询参数", 400);
  }

  // 从 R2 获取对象，传递请求头以支持范围请求和条件请求
  const object = await c.env.MY_BUCKET.get(objectName, {
    range: c.req.raw.headers, // 传递请求头以处理 Range 请求
    onlyIf: c.req.raw.headers, // 传递请求头以处理 If-None-Match 等条件请求
  });

  if (object === null) {
    return c.text(`对象 '${objectName}' 未找到`, 404);
  }

  // 准备响应头
  const headers = new Headers();
  object.writeHttpMetadata(headers); // 将 R2 对象的 HTTP 元数据（如 Content-Type）写入响应头
  headers.set("etag", object.httpEtag); // 设置 ETag 响应头，用于缓存控制

  // 处理范围请求 (部分内容)
  // 处理范围请求 (部分内容)
  if (object.range) {
    // R2Range 类型定义了 offset/length 或 suffix
    // 我们需要根据这些属性计算 Content-Range 的 start 和 end
    let rangeStart: number | undefined;
    let rangeEnd: number | undefined;

    if ("offset" in object.range) {
      rangeStart = object.range.offset;
      // 如果指定了 length，则结束位置是 offset + length - 1
      // 如果未指定 length，则范围是从 offset 到对象末尾
      rangeEnd =
        object.range.length !== undefined
          ? object.range.offset! + object.range.length - 1
          : object.size - 1;
    } else if ("suffix" in object.range) {
      // 如果指定了 suffix，则范围是对象的最后 'suffix' 个字节
      rangeStart = object.size - object.range.suffix;
      rangeEnd = object.size - 1;
    }

    // 确保计算出的范围有效且在对象大小范围内
    if (
      rangeStart !== undefined &&
      rangeEnd !== undefined &&
      rangeStart >= 0 &&
      rangeEnd >= rangeStart &&
      rangeEnd < object.size
    ) {
      headers.set("content-range", `bytes ${rangeStart}-${rangeEnd}/${object.size}`);
    } else {
      // 如果计算出的范围无效或结构不符合预期，记录警告
      console.warn(`为 key ${object.key} 计算出无效的范围:`, object.range);
      // 理论上 R2 返回的 range 应该是有效的，但以防万一
    }
  }

  // 确定状态码和响应体
  let status: number;
  let responseBody: ReadableStream | null = null;

  // 检查 object 是否包含 body 属性 (即它是 R2ObjectBody 而不仅仅是 R2Object)
  // R2ObjectBody 包含实际的对象数据流
  // 如果没有 body，通常意味着 onlyIf 条件满足，应返回 304
  if ("body" in object && object.body instanceof ReadableStream) {
    responseBody = object.body;
    // 如果客户端请求了 Range 头，并且我们返回了部分内容，状态码为 206
    // 否则为 200 OK
    status = c.req.header("range") ? 206 : 200;
  } else {
    // 没有 body，表示条件请求满足 (例如 ETag 匹配)，返回 304 Not Modified
    status = 304;
    responseBody = null;
    // 304 响应不应包含 Content-Range 头
    headers.delete("content-range");
  }

  // 将 Headers 对象转换为 Hono c.body 所需的 Record<string, string | string[]>
  // 注意：这里简化为 Record<string, string>，取每个 header 的第一个值
  const responseHeaders: Record<string, string> = {};
  headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  // 返回响应，包含对象主体 (ReadableStream) 或 null
  // Hono 的 c.body() 可以正确处理 ReadableStream，并设置状态码和头部
  return c.body(responseBody, status, responseHeaders);
});

/**
 * 列表返回结构
 * {
  "objects": [
    {
      "storageClass": "Standard",
      "uploaded": "2025-05-02T07:59:16.498Z",
      "checksums": {

      },
      "httpEtag": "\"d5272f2d025ff37d3b48e2a6f0aa34f0-6\"",
      "etag": "d5272f2d025ff37d3b48e2a6f0aa34f0-6",
      "size": 44218269,
      "version": "7e696ffe5420219cf19f8be347b382ab",
      "key": "short_videos/final-e-46f473e1-8210-4acc-84c4-8c9f39b6e3b8.mp4"
    },
    {
      "storageClass": "Standard",
      "uploaded": "2025-05-02T06:05:09.825Z",
      "checksums": {

      },
      "httpEtag": "\"30b1a23c18ce03414ca8ced9d0acacaf-2\"",
      "etag": "30b1a23c18ce03414ca8ced9d0acacaf-2",
      "size": 11334313,
      "version": "7e697066c9c56b9913eb3a1b9bd4fcf5",
      "key": "short_videos/final-e-49c2a8bb-6fdf-43b8-8046-97acdf5bfe8f.mp4"
    }
  ],
  "truncated": false,
  "delimitedPrefixes": [
    "short_videos/02/"
  ]
}

 */
r2Router.get("/r2/list", async (c) => {
  const url = new URL(c.req.url);

  const options: R2ListOptions = {
    prefix: url.searchParams.get("prefix") ?? "short_videos/",
    delimiter: url.searchParams.get("delimiter") ?? "/",
    cursor: url.searchParams.get("cursor") ?? undefined,
    // include: ["customMetadata", "httpMetadata"],
  };
  const listing = await c.env.MY_BUCKET.list(options);
  // 显示未表格结构
  const html = `
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Size</th>
          <th>actions</th>
        </tr>
      </thead>
      <tbody>
        ${listing.objects
          .map(
            (obj) => `
          <tr>
            <td><a href="/r2/get?key=${obj.key}">${obj.key}</a></td>
            <td>${obj.size}</td>
            <td><a href="/r2/get?key=${obj.key}">get</a></td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
    `;

  return c.html(html, 200);
});

export default r2Router;
