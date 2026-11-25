import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import styles from './index.module.scss';

export interface MessageStreamHandle {
  /** 平滑或立即滚回消息流最底部 */
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

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
  /** 向上滚动离开底部超过阈值（48px）时为 true，供外部显示「回到底部」悬浮按钮 */
  onShowScrollToBottomChange?: (visible: boolean) => void;
  /** 内边距等差异由调用方传入 */
  className?: string;
  children: ReactNode;
}

/** 判定「下方还有未滚动内容」的容差阈值（px） */
const BOTTOM_OVERFLOW_THRESHOLD = 4;
/** 判定显示居中「回到底部」圆形按钮的离底距离阈值（px） */
const SCROLL_TO_BOTTOM_THRESHOLD = 48;

/**
 * 消息流滚动容器
 * - 新消息到达或底栏展开导致高度变化时自动保持贴底，确保最新气泡完整可见；
 * - 支持 Figma 811:40261 顶部 35px 白色渐隐遮罩（滚动触发，pointer-events: none 不挡点击）；
 * - 实时上报下方溢出与「回到底部」按钮显隐状态，供底栏联动；
 * - 滚动条隐藏但保留滚动能力。
 */
export const MessageStream = forwardRef<MessageStreamHandle, MessageStreamProps>(
  (
    {
      scrollKey,
      withTopFade = false,
      bottomAligned = false,
      startAtTop = false,
      onBottomOverflowChange,
      onShowScrollToBottomChange,
      className,
      children,
    },
    ref,
  ) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const mounted = useRef(false);
    /** 首屏的 scrollKey：只要还是这一份内容就不滚（StrictMode 下 effect 会跑两遍，靠 key 判断而不是次数） */
    const initialKey = useRef(scrollKey);
    /** 记录用户是否正停在底部（用于底栏状态栏展开/内容增高时无感跟底，不打断向上翻看历史） */
    const pinnedToBottomRef = useRef(!startAtTop);
    const bottomOverflowRef = useRef<boolean | null>(null);
    const showScrollToBottomRef = useRef<boolean | null>(null);
    const bottomCallbackRef = useRef(onBottomOverflowChange);
    const scrollToBottomCallbackRef = useRef(onShowScrollToBottomChange);
    bottomCallbackRef.current = onBottomOverflowChange;
    scrollToBottomCallbackRef.current = onShowScrollToBottomChange;
    const [scrollFadeOpacity, setScrollFadeOpacity] = useState(0);

    const syncBottomFlags = (node: HTMLDivElement) => {
      const distToBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
      const hasBelow = distToBottom > BOTTOM_OVERFLOW_THRESHOLD;
      if (bottomOverflowRef.current !== hasBelow) {
        bottomOverflowRef.current = hasBelow;
        bottomCallbackRef.current?.(hasBelow);
      }
      const shouldShowBtn = distToBottom > SCROLL_TO_BOTTOM_THRESHOLD;
      if (showScrollToBottomRef.current !== shouldShowBtn) {
        showScrollToBottomRef.current = shouldShowBtn;
        scrollToBottomCallbackRef.current?.(shouldShowBtn);
      }
      return distToBottom;
    };

    useImperativeHandle(
      ref,
      () => ({
        scrollToBottom(behavior?: ScrollBehavior) {
          const node = scrollRef.current;
          if (!node) {
            return;
          }
          pinnedToBottomRef.current = true;
          const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const resolvedBehavior: ScrollBehavior = prefersReducedMotion
            ? 'auto'
            : (behavior ?? 'smooth');
          node.scrollTo({
            top: node.scrollHeight,
            behavior: resolvedBehavior,
          });
          if (resolvedBehavior === 'auto') {
            syncBottomFlags(node);
          }
        },
      }),
      [],
    );

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
        syncBottomFlags(node);
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
        return syncBottomFlags(node);
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
  },
);

MessageStream.displayName = 'MessageStream';
