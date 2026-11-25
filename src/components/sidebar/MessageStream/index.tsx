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
  /** 内边距等差异由调用方传入 */
  className?: string;
  children: ReactNode;
}

/**
 * 消息流滚动容器
 * - 新消息到达自动滚到底，保证最新纪要 / 回答可见；
 * - 支持 Figma 811:40261 顶部 35px 白色渐隐遮罩（滚动触发，pointer-events: none 不挡点击）；
 * - 滚动条隐藏但保留滚动能力。
 */
export const MessageStream: FC<MessageStreamProps> = ({
  scrollKey,
  withTopFade = false,
  bottomAligned = false,
  startAtTop = false,
  className,
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  /** 首屏的 scrollKey：只要还是这一份内容就不滚（StrictMode 下 effect 会跑两遍，靠 key 判断而不是次数） */
  const initialKey = useRef(scrollKey);
  const [scrollFadeOpacity, setScrollFadeOpacity] = useState(0);

  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      return;
    }
    if (startAtTop && scrollKey === initialKey.current) {
      mounted.current = true;
      return;
    }
    node.scrollTo({ top: node.scrollHeight, behavior: mounted.current ? 'smooth' : 'auto' });
    mounted.current = true;
  }, [scrollKey, startAtTop]);

  useEffect(() => {
    if (withTopFade !== 'scroll') {
      return undefined;
    }
    const node = scrollRef.current;
    if (!node) {
      return undefined;
    }
    const update = () => {
      const next = Math.min(1, Math.max(0, node.scrollTop / 16));
      setScrollFadeOpacity((prev) => (Math.abs(prev - next) < 0.02 ? prev : next));
    };
    update();
    node.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => {
      node.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [withTopFade, scrollKey]);

  const fadeOpacity = withTopFade === 'scroll' ? scrollFadeOpacity : withTopFade ? 1 : 0;

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
