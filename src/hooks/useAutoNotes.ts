import { useEffect, useRef } from 'react';
import { buildAutoNote } from '@/data/autoNotes';
import type { AssistantMessage } from '@/types/chat';

/**
 * 首条记录：进会后 15 秒记下第一句
 * 比后面快一档，演示时不用干等；此后恢复 30 秒的正常节奏。
 */
const FIRST_DELAY = 15_000;

/**
 * 之后的间隔（毫秒）：30 秒上下浮动，真人发言不会卡着整点开口
 * 每条消息都带「元宝 + 时间」，所以这个值就是你看到的时间戳间隔。
 */
const MIN_DELAY = 28_000;
const MAX_DELAY = 32_000;

/**
 * 自动记录驱动（演示用）
 * 首条 15 秒后出，之后每 30 秒左右让元宝记下一条会议内容，模拟会中实时记录；
 * 暂停记录后不再产生新内容，恢复后再重新计时（恢复时同样先快出一条）。
 *
 * @param push 追加一条元宝消息（useYuanbaoChat 的 push，引用稳定）
 * @param enabled 是否正在记笔记
 */
export function useAutoNotes(push: (message: AssistantMessage) => void, enabled: boolean): void {
  const timers = useRef<number[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let cancelled = false;
    let isFirst = true;
    const schedule = () => {
      const delay = isFirst ? FIRST_DELAY : MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
      isFirst = false;

      const timer = window.setTimeout(() => {
        if (cancelled) {
          return;
        }
        push(buildAutoNote(indexRef.current));
        indexRef.current += 1;
        schedule();
      }, delay);
      timers.current.push(timer);
    };

    schedule();

    return () => {
      cancelled = true;
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, [enabled, push]);
}
