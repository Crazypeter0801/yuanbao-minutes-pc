const pad = (value: number) => String(value).padStart(2, '0');

/**
 * IM 风格的居中时间
 * - 今天：15:52
 * - 昨天：昨天 15:52
 * - 更早：2026/11/04 15:52
 */
export function formatDividerTime(createdAt: number, now: number = Date.now()): string {
  const date = new Date(createdAt);
  const clock = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const dayMs = 24 * 60 * 60 * 1000;
  if (createdAt >= startOfToday.getTime()) {
    return clock;
  }
  if (createdAt >= startOfToday.getTime() - dayMs) {
    return `昨天 ${clock}`;
  }
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${clock}`;
}
