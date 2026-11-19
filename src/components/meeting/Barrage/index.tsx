import { useLayoutEffect, useRef, type FC } from 'react';
import type { BarrageItem } from '@/hooks/useMeetingChat';
import styles from './index.module.scss';

interface BarrageProps {
  items: BarrageItem[];
}

/**
 * 主画面左下角的弹幕（参考 Demo #barrage）
 * 新弹幕从下方弹上来，已有的几条用 FLIP 平滑上移；每条停 3.3 秒后淡出，最多同时 4 条。
 */
export const Barrage: FC<BarrageProps> = ({ items }) => {
  const nodes = useRef(new Map<number, HTMLDivElement>());
  const lastTops = useRef(new Map<number, number>());

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nextTops = new Map<number, number>();
    nodes.current.forEach((node, id) => {
      const top = node.getBoundingClientRect().top;
      nextTops.set(id, top);
      const previous = lastTops.current.get(id);
      if (!reduce && previous !== undefined && previous !== top) {
        node.animate([{ translate: `0 ${previous - top}px` }, { translate: '0 0' }], {
          duration: 280,
          easing: 'cubic-bezier(.22,1,.36,1)',
        });
      }
    });
    lastTops.current = nextTops;
  }, [items]);

  if (!items.length) {
    return null;
  }

  return (
    <div className={styles.stack} aria-live="polite">
      {items.map((item) => (
        <div
          key={item.id}
          ref={(node) => {
            if (node) {
              nodes.current.set(item.id, node);
            } else {
              nodes.current.delete(item.id);
            }
          }}
          className={`${styles.bubble} ${item.leaving ? styles.leaving : ''}`}
        >
          <strong className={styles.name}>{item.name}</strong>：{item.text}
        </div>
      ))}
    </div>
  );
};
