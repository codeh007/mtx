export function emitText(text: string) {
  const b = JSON.stringify(text);
  const a = `0:${b}\n`;
  return a;
}
