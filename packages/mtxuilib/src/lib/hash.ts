/**
 * 用 SHA-256 计算hash值后，用 a-zA-Z的字符表示最终的值
 * @param message
 * @returns
 */
export async function sha256WithAlphabets(message) {
  const buffer =
    typeof message === "object"
      ? new TextEncoder().encode(JSON.stringify(message))
      : new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  // 将哈希值转换为 Base64 编码
  const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  // 从 Base64 编码的字符串中提取字母部分
  const alphabetsOnly = hashBase64.replace(/[^a-zA-Z]/g, "");
  return alphabetsOnly;
}

export async function defaultHash(message) {
  const hash = await sha256WithAlphabets(message);
  return hash.slice(0, 16);
}
