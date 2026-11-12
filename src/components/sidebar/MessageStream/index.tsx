import { useLayoutEffect, useRef, type FC, type ReactNode } from 'react';
import styles from './index.module.scss';

interface MessageStreamProps {
  /** 变化时滚到底部（通常传消息数 + 思考态） */
  scrollKey: string | number;
  /** 顶部 40px 白色渐隐（方案 A 设计稿有） */
  withTopFade?: boolean;
  /** 内容不足一屏时贴底排列（方案 A 的 justify-content: flex-end） */
  bottomAligned?: boolean;
  /** 首次挂载的滚动位置：默认到底部；设计稿首屏停在顶部时传 top */
  initialScroll?: 'top' | 'bottom';
  /** 内边距等差异由调用方传入 */
  className?: string;
  children: ReactNode;
}

/**
 * 消息流滚动容器
 * - 新消息到达自动滚到底，保证最新纪要 / 回答可见；
 * - 首次挂载默认定位到底部；静态演示首屏可指定停在顶部；
 * - 滚动条隐藏但保留滚动能力。
 */
export const MessageStream: FC<MessageStreamProps> = ({
  scrollKey,
  withTopFade = false,
  bottomAligned = false,
  initialScroll = 'bottom',
  className,
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  /** 首屏的 scrollKey：值没变就还停在首屏，避免 StrictMode 二次执行 effect 时又滚到底 */
  const initialKey = useRef(scrollKey);

  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      return;
    }
    if (initialScroll === 'top' && scrollKey === initialKey.current) {
      node.scrollTo({ top: 0, behavior: 'auto' });
      mounted.current = true;
      return;
    }
    node.scrollTo({ top: node.scrollHeight, behavior: mounted.current ? 'smooth' : 'auto' });
    mounted.current = true;
  }, [scrollKey, initialScroll]);

  return (
    <div className={styles.wrap}>
      <div className={`${styles.scroll} wm-scroll-hidden`} ref={scrollRef}>
        <div
          className={[styles.content, bottomAligned ? styles.contentBottom : '', className ?? '']
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
      </div>
      {withTopFade && <div className={styles.fadeTop} aria-hidden="true" />}
    </div>
  );
};
