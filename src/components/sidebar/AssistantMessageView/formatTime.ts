/** 消息头的时间格式：2026/11/05 11:57（与元宝侧栏截图一致） */
export function formatMessageTime(createdAt: number): string {
  const date = new Date(createdAt);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}
