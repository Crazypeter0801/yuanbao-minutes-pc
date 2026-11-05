import type { TextRun } from '@/types/chat';

/**
 * 把带标记的文本解析成富文本片段
 *
 * 素材用纯字符串写，比手搓 run 对象轻得多，也才能随手把人名塞进句子中间：
 * - `**文字**` → 加粗（会议里需要被记住的结论）
 * - `[[人名]]`  → 人名胶囊（截图里的浅蓝底，可出现在句首或句中）
 *
 * 没闭合的标记按普通文字处理，不抛错——演示素材写错一个星号不该整页白屏。
 */
export function parseMarkedText(text: string): TextRun[] {
  const pattern = /\*\*[^*]+\*\*|\[\[[^\]]+\]\]/g;
  const runs: TextRun[] = [];
  let cursor = 0;

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      runs.push({ text: text.slice(cursor, index) });
    }

    const token = match[0];
    const inner = token.slice(2, -2);
    runs.push(token.startsWith('**') ? { text: inner, bold: true } : { text: inner, mention: true });
    cursor = index + token.length;
  }

  if (cursor < text.length) {
    runs.push({ text: text.slice(cursor) });
  }

  return runs.length > 0 ? runs : [{ text }];
}
