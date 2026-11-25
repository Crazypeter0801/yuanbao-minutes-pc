import { useEffect, useLayoutEffect, useRef, useState, type FC, type ReactNode } from 'react';
import styles from './index.module.scss';

interface MessageStreamProps {
  /** 变化时滚到底部（通常传消息数 + 思考态） */
  scrollKey: string | number;
  /**
   * 顶部 35px 白色渐隐（Figma 811:40261）：
   * - true：常驻显示
   * - 'scroll'：首屏 scrollTop=0 时隐藏不遮挡顶部时间/开场消息，纵向滚动后平滑淡入
   */
  withTopFade?: boolean | 'scroll';
  /** 内容不足一屏时贴底排列（方案 A 的 justify-content: flex-end） */
  bottomAligned?: boolean;
  /** 首次挂载停在顶部（入会稿 416:20464 展示的是对话开头），之后有新消息照常滚到底 */
  startAtTop?: boolean;
  /** 下方是否仍有未滚动到的内容（scrollHeight - scrollTop - clientHeight > 4） */
  onBottomOverflowChange?: (hasOverflowBelow: boolean) => void;
  /** 内边距等差异由调用方传入 */
  className?: string;
  children: ReactNode;
}

/** 判定「下方还有未滚动内容」的容差阈值（px） */
const BOTTOM_OVERFLOW_THRESHOLD = 4;

/**
 * 消息流滚动容器
 * - 新消息到达或底栏展开导致高度变化时自动保持贴底，确保最新气泡完整可见；
 * - 支持 Figma 811:40261 顶部 35px 白色渐隐遮罩（滚动触发，pointer-events: none 不挡点击）；
 * - 实时上报下方是否存在未滚动内容，供底栏决定是否显示底部白色渐隐；
 * - 滚动条隐藏但保留滚动能力。
 */
export const MessageStream: FC<MessageStreamProps> = ({
  scrollKey,
  withTopFade = false,
  bottomAligned = false,
  startAtTop = false,
  onBottomOverflowChange,
  className,
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  /** 首屏的 scrollKey：只要还是这一份内容就不滚（StrictMode 下 effect 会跑两遍，靠 key 判断而不是次数） */
  const initialKey = useRef(scrollKey);
  /** 记录用户是否正停在底部（用于底栏状态栏展开/内容增高时无感跟底，不打断向上翻看历史） */
  const pinnedToBottomRef = useRef(!startAtTop);
  const bottomOverflowRef = useRef<boolean | null>(null);
  const bottomCallbackRef = useRef(onBottomOverflowChange);
  bottomCallbackRef.current = onBottomOverflowChange;
  const [scrollFadeOpacity, setScrollFadeOpacity] = useState(0);

  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      return undefined;
    }
    if (startAtTop && scrollKey === initialKey.current) {
      mounted.current = true;
      return undefined;
    }
    pinnedToBottomRef.current = true;
    const scrollToBottom = () => {
      node.scrollTop = node.scrollHeight;
      const distToBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
      const hasBelow = distToBottom > BOTTOM_OVERFLOW_THRESHOLD;
      if (bottomOverflowRef.current !== hasBelow) {
        bottomOverflowRef.current = hasBelow;
        bottomCallbackRef.current?.(hasBelow);
      }
    };
    scrollToBottom();
    const rafId = window.requestAnimationFrame(scrollToBottom);
    mounted.current = true;
    return () => window.cancelAnimationFrame(rafId);
  }, [scrollKey, startAtTop]);

  useEffect(() => {
    const node = scrollRef.current;
    const content = contentRef.current;
    if (!node) {
      return undefined;
    }

    const reportMetrics = () => {
      if (withTopFade === 'scroll') {
        const next = Math.min(1, Math.max(0, node.scrollTop / 16));
        setScrollFadeOpacity((prev) => (Math.abs(prev - next) < 0.02 ? prev : next));
      }
      const distToBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
      const hasBelow = distToBottom > BOTTOM_OVERFLOW_THRESHOLD;
      if (bottomOverflowRef.current !== hasBelow) {
        bottomOverflowRef.current = hasBelow;
        bottomCallbackRef.current?.(hasBelow);
      }
      return distToBottom;
    };

    const onScroll = () => {
      const distToBottom = reportMetrics();
      pinnedToBottomRef.current = distToBottom <= 24;
    };

    const onResize = () => {
      if (pinnedToBottomRef.current) {
        node.scrollTop = node.scrollHeight;
      }
      reportMetrics();
    };

    reportMetrics();
    node.addEventListener('scroll', onScroll, { passive: true });
    const observer = new ResizeObserver(onResize);
    observer.observe(node);
    if (content) {
      observer.observe(content);
    }
    return () => {
      node.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [withTopFade, scrollKey]);

  const fadeOpacity = withTopFade === 'scroll' ? scrollFadeOpacity : withTopFade ? 1 : 0;

  return (
    <div className={styles.wrap}>
      <div className={`${styles.scroll} wm-scroll-hidden`} ref={scrollRef}>
        <div
          ref={contentRef}
          className={[styles.content, bottomAligned ? styles.contentBottom : '', className ?? '']
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
      </div>
      {withTopFade && (
        <div
          className={styles.fadeTop}
          style={{ opacity: fadeOpacity }}
          data-top-fade-visible={fadeOpacity > 0.05 ? 'true' : 'false'}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
