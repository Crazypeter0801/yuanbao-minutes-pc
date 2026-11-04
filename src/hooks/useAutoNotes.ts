import { useEffect, useRef } from 'react';
import { buildAutoNote } from '@/data/autoNotes';
import type { AssistantMessage } from '@/types/chat';

/** 两条自动记录之间的间隔（毫秒）：10–15 秒之间随机，听起来才像真的在说话 */
const MIN_DELAY = 10_000;
const MAX_DELAY = 15_000;

/**
 * 自动记录驱动（演示用）
 * 每 10–15 秒让元宝自动记下一条会议内容，模拟会中实时记录；
 * 暂停记录后不再产生新内容，恢复后再重新计时。
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
    const schedule = () => {
      const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
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
